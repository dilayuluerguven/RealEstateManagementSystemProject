declare module 'arcgis-rest-api' {
  export interface Feature {}
  export interface FeatureSet {}
  export interface Geometry {}
  export interface Point {}
  export interface Polyline {}
  export interface Polygon {}
  export interface Multipoint {}
  export interface HasZM {}
  export type Position = number[];
  export interface SpatialReferenceWkid {
    wkid?: number;
    latestWkid?: number;
  }
}
