/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DBSCAN.ts — Density-Based Spatial Clustering of Applications with Noise
 *
 * This algorithm groups similar data points (like customer messages/reviews)
 * together WITHOUT needing to know the number of groups (K) beforehand.
 * Crucially, it identifies "Noise" (irrelevant/junk messages) automatically.
 *
 * Lecture Parameters:
 *  - eps (Epsilon): Maximum distance to be considered a neighbor.
 *  - minPts: Minimum neighbors needed to form a "Core Point".
 *
 * Classifications:
 *  - Core Point: Has >= minPts neighbors within eps distance.
 *  - Border Point: Not a core point, but is a neighbor of a core point.
 *  - Noise Point: Neither a core nor a border point.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { TextSimilarity } from "./TextSimilarity";

export type PointStatus = "UNCLASSIFIED" | "CORE" | "BORDER" | "NOISE";

export interface DataPoint {
  id: string;
  vector: number[];        // The text embedding / TF-IDF vector
  originalText?: string;   // For reference in Anaos
  status: PointStatus;
  clusterId: number | null; // null means it's NOISE
}

export class DBSCAN {
  
  /**
   * Runs the DBSCAN clustering algorithm on an array of vectors.
   * Uses Euclidean Distance as the underlying metric.
   */
  static cluster(
    points: Omit<DataPoint, "status" | "clusterId">[], 
    eps: number, 
    minPts: number
  ): DataPoint[] {
    
    // Initialize points with UNCLASSIFIED status
    const data: DataPoint[] = points.map(p => ({
      ...p,
      status: "UNCLASSIFIED",
      clusterId: null
    }));

    let currentClusterId = 0;

    for (let i = 0; i < data.length; i++) {
      const p = data[i];

      // Skip if already processed
      if (p.status !== "UNCLASSIFIED") continue;

      // Find all neighbors for point p
      const neighbors = this.regionQuery(data, p, eps);

      if (neighbors.length < minPts) {
        // Not enough neighbors -> mark as NOISE (for now)
        p.status = "NOISE";
      } else {
        // We found a Core Point! Start a new cluster
        currentClusterId++;
        p.status = "CORE";
        p.clusterId = currentClusterId;

        // Expand the cluster to all reachable neighbors
        this.expandCluster(data, neighbors, currentClusterId, eps, minPts);
      }
    }

    return data;
  }

  /**
   * Expands the cluster to all densely reachable points.
   */
  private static expandCluster(
    data: DataPoint[],
    neighbors: number[],
    clusterId: number,
    eps: number,
    minPts: number
  ) {
    // Process every neighbor found
    for (let i = 0; i < neighbors.length; i++) {
      const neighborIdx = neighbors[i];
      const neighborPt = data[neighborIdx];

      // If it was marked as NOISE, it's actually a BORDER point of this cluster
      if (neighborPt.status === "NOISE") {
        neighborPt.status = "BORDER";
        neighborPt.clusterId = clusterId;
      }

      // If it's already processed and in a cluster, skip
      if (neighborPt.status !== "UNCLASSIFIED") continue;

      // Otherwise, add it to the current cluster
      neighborPt.clusterId = clusterId;

      // Check if this neighbor is ALSO a Core Point
      const newNeighbors = this.regionQuery(data, neighborPt, eps);
      if (newNeighbors.length >= minPts) {
        neighborPt.status = "CORE";
        // Merge the new neighbors into our processing queue
        for (const n of newNeighbors) {
          if (!neighbors.includes(n)) {
            neighbors.push(n);
          }
        }
      } else {
        neighborPt.status = "BORDER";
      }
    }
  }

  /**
   * Finds all points within 'eps' distance of point p.
   * Returns an array of indexes.
   */
  private static regionQuery(data: DataPoint[], p: DataPoint, eps: number): number[] {
    const neighbors: number[] = [];
    for (let i = 0; i < data.length; i++) {
      // Use Euclidean Distance from our TextSimilarity module
      const distance = TextSimilarity.euclideanDistance(p.vector, data[i].vector);
      if (distance <= eps) {
        neighbors.push(i);
      }
    }
    return neighbors;
  }
}
