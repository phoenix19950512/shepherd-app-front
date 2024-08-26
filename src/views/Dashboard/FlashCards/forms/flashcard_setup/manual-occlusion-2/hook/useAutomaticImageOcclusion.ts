import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import ApiService from '../../../../../../../services/ApiService';

// Define the type for the coordinates
type Coords = [number, number, number, number];

// Define the type for the occlusion
type Occlusion = {
  coor: Coords;
};

function areClose(el1, el2, threshold = 5) {
  const [x1, y1, w1, h1] = el1.coor;
  const [x2, y2, w2, h2] = el2.coor;

  return (
    x1 + w1 + threshold >= x2 &&
    x2 + w2 + threshold >= x1 &&
    y1 + h1 + threshold >= y2 &&
    y2 + h2 + threshold >= y1
  );
}

function mergeClusters(clusters) {
  let merged = false;

  for (let i = 0; i < clusters.length; i++) {
    for (let j = i + 1; j < clusters.length; j++) {
      if (
        clusters[i].some((e1) => clusters[j].some((e2) => areClose(e1, e2)))
      ) {
        clusters[i] = [...clusters[i], ...clusters[j]];
        clusters.splice(j, 1);
        merged = true;
        break;
      }
    }
    if (merged) break;
  }

  if (merged) mergeClusters(clusters);
}

function clusterElements(elements) {
  let clusters = elements.map((el) => [el]);

  mergeClusters(clusters);

  return clusters.map((cluster) => {
    const ids = cluster.map((el) => el.id);
    const xs = cluster.map((el) => el.coor[0]);
    const ys = cluster.map((el) => el.coor[1]);
    const ws = cluster.map((el) => el.coor[0] + el.coor[2]);
    const hs = cluster.map((el) => el.coor[1] + el.coor[3]);

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...ws);
    const maxY = Math.max(...hs);

    return {
      id: ids.join('-'),
      coor: [minX, minY, maxX - minX, maxY - minY]
    };
  });
}

function useAutomaticImageOcclusion() {
  const getOcclusionCoordinates = async (imgURL: string) => {
    const img = new Image();
    img.src = imgURL;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    canvas.width = 714;
    canvas.height = 475;
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, 714, 475);

    const resizedImageURI = canvas.toDataURL('image/jpeg');
    console.log('resizedImageURI', resizedImageURI);

    let data;
    let error = '';
    try {
      const response = await ApiService.getOcclusionImageText(resizedImageURI);

      if (!response.ok) {
        error = 'Something went wrong. Please try again later.';
        throw new Error(
          `There was a problem with the network request. Status: ${response.status}`
        );
      }

      data = await response.json();
    } catch (error) {
      throw new Error(
        'There was a problem fetching the occlusion coordinates. Please try again later.'
      );
    }

    const elements = data.data;
    console.log('elements', elements);
    let processedData = data.data.map((block, index) => {
      return {
        id: index,
        coor: [
          block.boundingBox[0][0],
          block.boundingBox[0][1],
          block.boundingBox[1][0] - block.boundingBox[0][0],
          block.boundingBox[2][1] - block.boundingBox[0][1]
        ]
      };
    });
    const mergedEle = clusterElements(processedData);

    return { mergedEle, error };
  };
  return { getOcclusionCoordinates };
}

export default useAutomaticImageOcclusion;
