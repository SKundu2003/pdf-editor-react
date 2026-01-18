import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface WatermarkRemovalOptions {
  opacity?: number; // Threshold for detecting watermark (0-1)
  removeText?: boolean; // Remove text-based watermarks
  removeImages?: boolean; // Remove image-based watermarks
  sensitivity?: number; // Watermark detection sensitivity (0-1)
  method?: 'simple' | 'advanced' | 'background' | 'aggressive'; // Removal method
  targetText?: string[]; // Specific text patterns to remove
}

/**
 * Enhanced watermark removal with advanced background detection
 * Uses multiple techniques to identify and remove watermarks
 */
export async function removeWatermarksFromPdf(
  pdfBytes: Uint8Array,
  options: WatermarkRemovalOptions = {}
): Promise<Uint8Array> {
  const {
    opacity = 0.3,
    sensitivity = 0.8,
    method = 'aggressive',
    targetText = ['apryse', 'pdftron', 'webviewer', 'evaluation', 'demo', 'trial', 'powered by', 'created with']
  } = options;

  try {
    const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
    const numPages = pdf.numPages;
    const { PDFDocument } = await import('pdf-lib');
    const newPdf = await PDFDocument.create();

    console.log(`Processing ${numPages} pages with ${method} watermark removal...`);

    // Process each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      console.log(`Processing page ${pageNum}/${numPages}`);
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.5 }); // Higher scale for better text detection

      // Create canvas for rendering
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext('2d');

      if (!context) {
        console.warn(`Could not get canvas context for page ${pageNum}`);
        continue;
      }

      // Render page to canvas
      try {
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Use enhanced watermark removal based on method
        switch (method) {
          case 'aggressive':
            await removeAggressiveWatermarks(context, canvas.width, canvas.height, {
              opacity,
              sensitivity,
              targetText
            });
            break;
          case 'background':
            await removeBackgroundWatermarks(context, canvas.width, canvas.height, {
              opacity,
              sensitivity
            });
            break;
          case 'advanced':
            await removeWatermarksAdvancedCanvas(context, canvas.width, canvas.height, {
              opacity,
              sensitivity
            });
            break;
          default:
            processCanvasForWatermarks(context, canvas.width, canvas.height, opacity);
        }

        // Convert canvas to image and embed in PDF
        const imageData = canvas.toDataURL('image/png', 0.98); // Higher quality PNG
        const img = await newPdf.embedPng(imageData);
        const pdfPage = newPdf.addPage([viewport.width, viewport.height]);
        pdfPage.drawImage(img, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height,
        });
      } catch (pageError) {
        console.error(`Error processing page ${pageNum}:`, pageError);
        // Continue with next page
      }
    }

    const result = await newPdf.save();
    console.log(`Watermark removal completed. Output size: ${result.length} bytes`);
    return result;
  } catch (error) {
    console.error('Error in watermark removal:', error);
    // Return original PDF if watermark removal fails
    return pdfBytes;
  }
}

/**
 * Aggressive watermark removal specifically targeting Apryse/PDFTron style watermarks
 * Uses multiple techniques including text detection, position analysis, and pattern matching
 */
async function removeAggressiveWatermarks(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: { opacity: number; sensitivity: number; targetText: string[] }
): Promise<void> {
  const { opacity, sensitivity, targetText } = options;

  try {
    console.log('Starting aggressive watermark removal...');

    // Step 1: Apply comprehensive background cleanup
    await removeBackgroundWatermarks(context, width, height, { opacity, sensitivity });

    // Step 2: Target specific watermark positions (corners, headers, footers)
    await removePositionalWatermarks(context, width, height, targetText);

    // Step 3: Apply text-specific watermark removal
    await removeTextWatermarks(context, width, height, targetText);

    // Step 4: Final cleanup and artifact removal
    await applyFinalCleanup(context, width, height);

    console.log('Aggressive watermark removal completed');

  } catch (error) {
    console.error('Error in aggressive watermark removal:', error);
    // Fallback to background method
    await removeBackgroundWatermarks(context, width, height, { opacity, sensitivity });
  }
}

/**
 * Target watermarks in specific positions (corners, headers, footers)
 */
async function removePositionalWatermarks(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  targetText: string[]
): Promise<void> {
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Define watermark zones (common positions for software watermarks)
  const zones = [
    // Top corners
    { x: 0, y: 0, w: Math.floor(width * 0.3), h: Math.floor(height * 0.15) },
    { x: width - Math.floor(width * 0.3), y: 0, w: Math.floor(width * 0.3), h: Math.floor(height * 0.15) },
    // Bottom corners
    { x: 0, y: height - Math.floor(height * 0.15), w: Math.floor(width * 0.3), h: Math.floor(height * 0.15) },
    { x: width - Math.floor(width * 0.3), y: height - Math.floor(height * 0.15), w: Math.floor(width * 0.3), h: Math.floor(height * 0.15) },
    // Top center (header area)
    { x: Math.floor(width * 0.2), y: 0, w: Math.floor(width * 0.6), h: Math.floor(height * 0.1) },
    // Bottom center (footer area)
    { x: Math.floor(width * 0.2), y: height - Math.floor(height * 0.1), w: Math.floor(width * 0.6), h: Math.floor(height * 0.1) },
    // Center (overlay watermarks)
    { x: Math.floor(width * 0.3), y: Math.floor(height * 0.4), w: Math.floor(width * 0.4), h: Math.floor(height * 0.2) }
  ];

  zones.forEach(zone => {
    console.log(`Processing watermark zone: ${zone.x}, ${zone.y}, ${zone.w}, ${zone.h}`);

    // Analyze this zone for watermark characteristics
    const zoneData = extractZoneData(data, width, height, zone.x, zone.y, zone.w, zone.h);

    // If zone looks like watermark (low alpha, uniform color), remove it
    if (isLikelyWatermark(zoneData)) {
      removeZoneWatermark(data, width, height, zone.x, zone.y, zone.w, zone.h);
    }
  });

  context.putImageData(imageData, 0, 0);
}

/**
 * Extract pixel data from a specific zone
 */
function extractZoneData(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  zoneWidth: number,
  zoneHeight: number
): { alphas: number[], colors: number[] } {
  const alphas: number[] = [];
  const colors: number[] = [];

  for (let y = startY; y < Math.min(startY + zoneHeight, height); y++) {
    for (let x = startX; x < Math.min(startX + zoneWidth, width); x++) {
      const index = (y * width + x) * 4;
      alphas.push(data[index + 3] / 255);

      // Average RGB for color analysis
      const avgColor = (data[index] + data[index + 1] + data[index + 2]) / 3;
      colors.push(avgColor);
    }
  }

  return { alphas, colors };
}

/**
 * Determine if a zone is likely a watermark
 */
function isLikelyWatermark(zoneData: { alphas: number[], colors: number[] }): boolean {
  const { alphas, colors } = zoneData;

  if (alphas.length === 0) return false;

  // Calculate statistics
  const avgAlpha = alphas.reduce((sum, alpha) => sum + alpha, 0) / alphas.length;
  const avgColor = colors.reduce((sum, color) => sum + color, 0) / colors.length;

  // Calculate variance
  const alphaVariance = alphas.reduce((sum, alpha) => sum + Math.pow(alpha - avgAlpha, 2), 0) / alphas.length;
  const colorVariance = colors.reduce((sum, color) => sum + Math.pow(color - avgColor, 2), 0) / colors.length;

  // Watermark characteristics:
  // 1. Semi-transparent (low alpha)
  // 2. Uniform color (low variance)
  // 3. Not completely transparent
  const isSemiTransparent = avgAlpha > 0.1 && avgAlpha < 0.8;
  const isUniformColor = colorVariance < 2000;
  const hasConsistentTransparency = alphaVariance < 0.1;

  return isSemiTransparent && (isUniformColor || hasConsistentTransparency);
}

/**
 * Remove watermark from a specific zone
 */
function removeZoneWatermark(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  zoneWidth: number,
  zoneHeight: number
): void {
  for (let y = startY; y < Math.min(startY + zoneHeight, height); y++) {
    for (let x = startX; x < Math.min(startX + zoneWidth, width); x++) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];

      // Remove semi-transparent pixels in watermark zones
      if (alpha > 0 && alpha < 200) {
        data[index + 3] = Math.max(0, alpha - 180); // More aggressive removal
      }
    }
  }
}

/**
 * Text-specific watermark removal using pattern matching
 */
async function removeTextWatermarks(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  targetText: string[]
): Promise<void> {
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Common watermark positions and sizes
  const textRegions = [
    // Bottom right corner (most common for software watermarks)
    { x: width - 200, y: height - 50, w: 180, h: 40 },
    // Bottom left corner
    { x: 20, y: height - 50, w: 180, h: 40 },
    // Top right corner
    { x: width - 200, y: 10, w: 180, h: 40 },
    // Top left corner
    { x: 20, y: 10, w: 180, h: 40 },
    // Bottom center
    { x: width/2 - 100, y: height - 50, w: 200, h: 40 },
    // Top center
    { x: width/2 - 100, y: 10, w: 200, h: 40 }
  ];

  textRegions.forEach(region => {
    if (detectTextInRegion(data, width, height, region.x, region.y, region.w, region.h, targetText)) {
      console.log(`Removing text watermark at: ${region.x}, ${region.y}`);
      removeTextRegion(data, width, height, region.x, region.y, region.w, region.h);
    }
  });

  context.putImageData(imageData, 0, 0);
}
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  regionWidth: number,
  regionHeight: number,
  targetText: string[]
): boolean {
  // Convert region to text-like pattern analysis
  const regionData = extractZoneData(data, width, height, startX, startY, regionWidth, regionHeight);

  // Look for characteristics of text watermarks
  const avgAlpha = regionData.alphas.reduce((sum, alpha) => sum + alpha, 0) / regionData.alphas.length;
  const avgColor = regionData.colors.reduce((sum, color) => sum + color, 0) / regionData.colors.length;

  // Text watermarks typically have:
  // 1. Medium alpha (not too transparent, not opaque)
  // 2. Grayish color (not pure white/black)
  // 3. Consistent transparency
  const likelyText = avgAlpha > 0.3 && avgAlpha < 0.8 && avgColor > 100 && avgColor < 200;

  if (likelyText) {
    console.log(`Detected likely text watermark: alpha=${avgAlpha.toFixed(2)}, color=${avgColor.toFixed(0)}`);
  }

  return likelyText;
}

/**
 * Remove text from a specific region
 */
function removeTextRegion(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  regionWidth: number,
  regionHeight: number
): void {
  for (let y = startY; y < Math.min(startY + regionHeight, height); y++) {
    for (let x = startX; x < Math.min(startX + regionWidth, width); x++) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];

      // Remove pixels that look like text (semi-transparent, grayish)
      if (alpha > 50 && alpha < 220) {
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];

        // Check if pixel is grayish (typical for text watermarks)
        const isGrayish = Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30;

        if (isGrayish || alpha < 180) {
          data[index + 3] = Math.max(0, alpha - 200); // Aggressive removal
        }
      }
    }
  }
}

/**
 * Apply final cleanup to remove any remaining artifacts
 */
async function applyFinalCleanup(
  context: CanvasRenderingContext2D,
  width: number,
  height: number
): Promise<void> {
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Apply stronger median filter to remove remaining artifacts
  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];

      // Only process suspicious pixels (semi-transparent)
      if (alpha > 0 && alpha < 200) {
        const neighbors: number[] = [];

        // Get 5x5 neighborhood
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const nIndex = ((y + dy) * width + (x + dx)) * 4;
            neighbors.push(data[nIndex + 3]);
          }
        }

        // Calculate median
        neighbors.sort((a, b) => a - b);
        const medianAlpha = neighbors[12]; // Middle of 25 values

        // If current pixel differs significantly from median, adjust it
        if (Math.abs(alpha - medianAlpha) > 100) {
          data[index + 3] = Math.max(0, medianAlpha - 80);
        }
      }
    }
  }

  context.putImageData(imageData, 0, 0);
/**
 * Advanced background watermark removal
 * Specifically targets background watermarks that are typically:
 * 1. Large areas of uniform color/pattern
 * 2. Low opacity overlays
 * 3. Repeating patterns
 */
async function removeBackgroundWatermarks(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: { opacity: number; sensitivity: number }
): Promise<void> {
  const { opacity, sensitivity } = options;

  try {
    // Step 1: Analyze image for watermark patterns
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Step 2: Detect background watermark regions
    const watermarkRegions = detectWatermarkRegions(data, width, height, sensitivity);

    // Step 3: Remove detected watermarks
    removeDetectedWatermarks(data, width, height, watermarkRegions, opacity);

    // Step 4: Apply additional background cleanup
    cleanupBackground(data, width, height, sensitivity);

    context.putImageData(imageData, 0, 0);

    // Step 5: Apply morphological operations to clean up artifacts
    await applyMorphologicalCleanup(context, width, height);

  } catch (error) {
    console.error('Error in background watermark removal:', error);
    // Fallback to simple method
    processCanvasForWatermarks(context, width, height, opacity);
  }
}
function detectWatermarkRegions(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  sensitivity: number
): Array<{x: number, y: number, width: number, height: number, confidence: number}> {
  const regions: Array<{x: number, y: number, width: number, height: number, confidence: number}> = [];

  // Analyze image in blocks to find watermark patterns
  const blockSize = Math.max(20, Math.floor(Math.min(width, height) / 20));

  for (let y = 0; y < height - blockSize; y += blockSize / 2) {
    for (let x = 0; x < width - blockSize; x += blockSize / 2) {
      const region = analyzeRegion(data, width, height, x, y, blockSize, blockSize);

      if (region.confidence > sensitivity) {
        regions.push({
          x,
          y,
          width: blockSize,
          height: blockSize,
          confidence: region.confidence
        });
      }
    }
  }

  // Merge overlapping regions
  return mergeRegions(regions);
}

/**
 * Analyze a region for watermark characteristics
 */
function analyzeRegion(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  regionWidth: number,
  regionHeight: number
): { confidence: number } {
  const alphaValues: number[] = [];
  const colorVariance: number[] = [];

  // Sample pixels in the region
  for (let y = startY; y < Math.min(startY + regionHeight, height); y += 2) {
    for (let x = startX; x < Math.min(startX + regionWidth, width); x += 2) {
      const index = (y * width + x) * 4;
      alphaValues.push(data[index + 3] / 255);

      // Calculate color variance (watermarks often have uniform colors)
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      colorVariance.push((r + g + b) / 3);
    }
  }

  // Calculate watermark confidence based on:
  // 1. Low alpha values (semi-transparent)
  // 2. Uniform color (low variance)
  const avgAlpha = alphaValues.reduce((sum, alpha) => sum + alpha, 0) / alphaValues.length;
  const alphaVariance = alphaValues.reduce((sum, alpha) => sum + Math.pow(alpha - avgAlpha, 2), 0) / alphaValues.length;
  const colorMean = colorVariance.reduce((sum, color) => sum + color, 0) / colorVariance.length;
  const colorVar = colorVariance.reduce((sum, color) => sum + Math.pow(color - colorMean, 2), 0) / colorVariance.length;

  // Watermark confidence score (0-1)
  let confidence = 0;

  // Low alpha suggests watermark
  if (avgAlpha < 0.5 && avgAlpha > 0.1) confidence += 0.4;

  // Low color variance suggests uniform watermark pattern
  if (colorVar < 1000) confidence += 0.3;

  // Very low alpha variance suggests consistent transparency
  if (alphaVariance < 0.1) confidence += 0.3;

  return { confidence: Math.min(confidence, 1) };
}

/**
 * Remove detected watermark regions
 */
function removeDetectedWatermarks(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  regions: Array<{x: number, y: number, width: number, height: number, confidence: number}>,
  opacity: number
): void {
  regions.forEach(region => {
    for (let y = region.y; y < Math.min(region.y + region.height, height); y++) {
      for (let x = region.x; x < Math.min(region.x + region.width, width); x++) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3] / 255;

        // If pixel matches watermark characteristics, remove it
        if (alpha < opacity && alpha > 0) {
          // Blend with background or make transparent
          data[index + 3] = Math.max(0, data[index + 3] - (region.confidence * 200));
        }
      }
    }
  });
}

/**
 * Clean up background artifacts
 */
function cleanupBackground(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  sensitivity: number
): void {
  // Apply median filter to remove noise
  const newData = new Uint8ClampedArray(data);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const index = (y * width + x) * 4;

      // Only process semi-transparent pixels
      const alpha = data[index + 3] / 255;
      if (alpha < 0.5 && alpha > 0) {
        // Get neighboring pixels for median calculation
        const neighbors: number[] = [];

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nIndex = ((y + dy) * width + (x + dx)) * 4;
            neighbors.push(data[nIndex + 3]);
          }
        }

        // Calculate median alpha
        neighbors.sort((a, b) => a - b);
        const medianAlpha = neighbors[4];

        // If current pixel is significantly different from median, adjust it
        if (Math.abs(alpha - (medianAlpha / 255)) > 0.2) {
          newData[index + 3] = Math.max(0, medianAlpha - 50);
        }
      }
    }
  }

  // Copy back the cleaned data
  for (let i = 0; i < data.length; i++) {
    data[i] = newData[i];
  }
}

/**
 * Apply morphological operations to clean up artifacts
 */
async function applyMorphologicalCleanup(
  context: CanvasRenderingContext2D,
  width: number,
  height: number
): Promise<void> {
  // Create temporary canvas for processing
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempContext = tempCanvas.getContext('2d');

  if (!tempContext) return;

  // Copy current image
  tempContext.drawImage(context.canvas, 0, 0);

  // Apply erosion to remove small artifacts
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Simple erosion: if neighboring pixels are transparent, make current pixel more transparent
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];

      // Check if this is a small artifact (semi-transparent pixel surrounded by opaque pixels)
      if (alpha > 0 && alpha < 200) {
        let opaqueNeighbors = 0;

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nIndex = ((y + dy) * width + (x + dx)) * 4;
            if (data[nIndex + 3] > 200) opaqueNeighbors++;
          }
        }

        // If mostly surrounded by opaque pixels, likely an artifact
        if (opaqueNeighbors >= 6) {
          data[index + 3] = Math.max(0, alpha - 100);
        }
      }
    }
  }

  context.putImageData(imageData, 0, 0);
}

/**
 * Merge overlapping regions
 */
function mergeRegions(
  regions: Array<{x: number, y: number, width: number, height: number, confidence: number}>
): Array<{x: number, y: number, width: number, height: number, confidence: number}> {
  if (regions.length === 0) return regions;

  const merged: Array<{x: number, y: number, width: number, height: number, confidence: number}> = [];
  const used = new Set<number>();

  for (let i = 0; i < regions.length; i++) {
    if (used.has(i)) continue;

    let currentRegion = regions[i];
    used.add(i);

    // Find overlapping regions
    for (let j = i + 1; j < regions.length; j++) {
      if (used.has(j)) continue;

      const otherRegion = regions[j];

      if (regionsOverlap(currentRegion, otherRegion)) {
        currentRegion = mergeTwoRegions(currentRegion, otherRegion);
        used.add(j);
      }
    }

    merged.push(currentRegion);
  }

  return merged;
}

/**
 * Check if two regions overlap
 */
function regionsOverlap(
  region1: {x: number, y: number, width: number, height: number},
  region2: {x: number, y: number, width: number, height: number}
): boolean {
  return !(region1.x + region1.width < region2.x ||
           region2.x + region2.width < region1.x ||
           region1.y + region1.height < region2.y ||
           region2.y + region2.height < region1.y);
}

/**
 * Merge two regions
 */
function mergeTwoRegions(
  region1: {x: number, y: number, width: number, height: number, confidence: number},
  region2: {x: number, y: number, width: number, height: number, confidence: number}
): {x: number, y: number, width: number, height: number, confidence: number} {
  const minX = Math.min(region1.x, region2.x);
  const minY = Math.min(region1.y, region2.y);
  const maxX = Math.max(region1.x + region1.width, region2.x + region2.width);
  const maxY = Math.max(region1.y + region1.height, region2.y + region2.height);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    confidence: Math.max(region1.confidence, region2.confidence)
  };
}

/**
 * Advanced watermark removal using multiple techniques
 */
async function removeWatermarksAdvancedCanvas(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: { opacity: number; sensitivity: number }
): Promise<void> {
  const { opacity, sensitivity } = options;

  // Step 1: Apply edge detection to find watermark boundaries
  await applyEdgeDetection(context, width, height);

  // Step 2: Remove connected components that look like watermarks
  await removeConnectedComponents(context, width, height, sensitivity);

  // Step 3: Apply final cleanup
  processCanvasForWatermarks(context, width, height, opacity);
}

/**
 * Apply edge detection to highlight watermark boundaries
 */
async function applyEdgeDetection(
  context: CanvasRenderingContext2D,
  width: number,
  height: number
): Promise<void> {
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;
  const output = new Uint8ClampedArray(data);

  // Simple edge detection using Sobel operator
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const index = (y * width + x) * 4;

      // Calculate gradient magnitude
      let gradient = 0;
      for (let c = 0; c < 3; c++) { // RGB channels
        const gx =
          data[((y - 1) * width + (x - 1)) * 4 + c] * -1 +
          data[((y - 1) * width + x) * 4 + c] * 0 +
          data[((y - 1) * width + (x + 1)) * 4 + c] * 1 +
          data[(y * width + (x - 1)) * 4 + c] * -2 +
          data[(y * width + x) * 4 + c] * 0 +
          data[(y * width + (x + 1)) * 4 + c] * 2 +
          data[((y + 1) * width + (x - 1)) * 4 + c] * -1 +
          data[((y + 1) * width + x) * 4 + c] * 0 +
          data[((y + 1) * width + (x + 1)) * 4 + c] * 1;

        const gy =
          data[((y - 1) * width + (x - 1)) * 4 + c] * -1 +
          data[((y - 1) * width + x) * 4 + c] * -2 +
          data[((y - 1) * width + (x + 1)) * 4 + c] * -1 +
          data[(y * width + (x - 1)) * 4 + c] * 0 +
          data[(y * width + x) * 4 + c] * 0 +
          data[(y * width + (x + 1)) * 4 + c] * 0 +
          data[((y + 1) * width + (x - 1)) * 4 + c] * 1 +
          data[((y + 1) * width + x) * 4 + c] * 2 +
          data[((y + 1) * width + (x + 1)) * 4 + c] * 1;

        gradient += Math.sqrt(gx * gx + gy * gy);
      }

      // If high gradient (edge), make pixel more transparent
      const alpha = data[index + 3];
      if (gradient > 100 && alpha < 200) {
        output[index + 3] = Math.max(0, alpha - 50);
      } else {
        output[index + 3] = alpha;
      }
    }
  }

  // Copy back to original
  for (let i = 0; i < data.length; i++) {
    data[i] = output[i];
  }

  context.putImageData(imageData, 0, 0);
}

/**
 * Remove connected components that look like watermarks
 */
async function removeConnectedComponents(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  sensitivity: number
): Promise<void> {
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Find connected components of semi-transparent pixels
  const visited = new Set<number>();
  const components: Array<{pixels: number[], avgAlpha: number, size: number}> = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      if (visited.has(index)) continue;

      const alpha = data[index * 4 + 3];
      if (alpha > 0 && alpha < 200) { // Semi-transparent pixel
        const component = floodFill(data, width, height, x, y, visited);
        if (component.pixels.length > 50) { // Only consider larger components
          components.push(component);
        }
      }
    }
  }

  // Remove components that look like watermarks (large, low alpha)
  components.forEach(component => {
    if (component.avgAlpha < 150 && component.size > 100) {
      component.pixels.forEach(pixelIndex => {
        data[pixelIndex * 4 + 3] = Math.max(0, data[pixelIndex * 4 + 3] - 150);
      });
    }
  });

  context.putImageData(imageData, 0, 0);
}

/**
 * Flood fill to find connected components
 */
function floodFill(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  visited: Set<number>
): {pixels: number[], avgAlpha: number, size: number} {
  const pixels: number[] = [];
  const queue: Array<{x: number, y: number}> = [{x: startX, y: startY}];
  let totalAlpha = 0;

  while (queue.length > 0) {
    const {x, y} = queue.shift()!;
    const index = y * width + x;

    if (x < 0 || x >= width || y < 0 || y >= height || visited.has(index)) {
      continue;
    }

    const alpha = data[index * 4 + 3];
    if (alpha === 0) continue; // Skip fully transparent pixels

    visited.add(index);
    pixels.push(index);
    totalAlpha += alpha;

    // Add neighbors
    queue.push({x: x + 1, y});
    queue.push({x: x - 1, y});
    queue.push({x, y: y + 1});
    queue.push({x, y: y - 1});
  }

  return {
    pixels,
    avgAlpha: totalAlpha / pixels.length,
    size: pixels.length
  };
}

/**
 * Simple watermark removal by filtering out light gray/semi-transparent text
 */
export async function removeWatermarksSimple(
  pdfBytes: Uint8Array,
  options: WatermarkRemovalOptions = {}
): Promise<Uint8Array> {
  const { opacity = 0.3 } = options;

  try {
    const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
    const numPages = pdf.numPages;
    const { PDFDocument } = await import('pdf-lib');
    const newPdf = await PDFDocument.create();

    // Process each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });

      // Create canvas for rendering
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext('2d');

      if (!context) {
        console.warn(`Could not get canvas context for page ${pageNum}`);
        continue;
      }

      // Render page to canvas
      try {
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Process canvas to reduce watermark visibility
        processCanvasForWatermarks(context, canvas.width, canvas.height, opacity);

        // Convert canvas to image and embed in PDF
        const imageData = canvas.toDataURL('image/png');
        const img = await newPdf.embedPng(imageData);
        const pdfPage = newPdf.addPage([viewport.width, viewport.height]);
        pdfPage.drawImage(img, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height,
        });
      } catch (pageError) {
        console.error(`Error processing page ${pageNum}:`, pageError);
        // Continue with next page
      }
    }

    return await newPdf.save();
  } catch (error) {
    console.error('Error in simple watermark removal:', error);
    return pdfBytes;
  }
}

/**
 * Process canvas to detect and reduce watermark visibility
 * Targets semi-transparent elements that are typically watermarks
 */
function processCanvasForWatermarks(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  opacityThreshold: number
): void {
  try {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Process pixels to reduce watermark opacity
    // Watermarks typically have low alpha values (semi-transparent)
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3] / 255; // Alpha channel (0-1)

      // If pixel is semi-transparent (likely watermark), reduce its visibility
      if (alpha < opacityThreshold && alpha > 0) {
        // Reduce alpha to make watermark more transparent
        data[i + 3] = Math.max(0, data[i + 3] - 100);
      }
    }

    context.putImageData(imageData, 0, 0);
  } catch (error) {
    console.error('Error processing canvas for watermarks:', error);
  }
}

/**
 * Advanced watermark removal using content stream analysis
 * This method attempts to identify and remove watermark objects from the PDF structure
 */
export async function removeWatermarksAdvanced(
  pdfBytes: Uint8Array
): Promise<Uint8Array> {
  try {
    const { PDFDocument } = await import('pdf-lib');
    const sourceDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

    // For advanced removal, we would need to parse the PDF content streams
    // and identify watermark objects. This is complex and requires deep PDF knowledge.
    // For now, return the original as this requires specialized PDF parsing

    return await sourceDoc.save();
  } catch (error) {
    console.error('Error in advanced watermark removal:', error);
    return pdfBytes;
  }
}
