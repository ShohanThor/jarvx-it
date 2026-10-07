/**
 * JX mark geometry, traced from the brand logo (viewBox 0 0 120 94).
 * J: a single continuous stroke — top bar, down, rounded bottom, then the rising diagonal.
 * X: the crossing navy stroke.
 */
export const LOGO_VIEWBOX = "0 0 120 94";
export const LOGO_STROKE = 15;
export const J_PATH = "M10 12 H27 Q34 12 34 19 V64 Q34 82 52 82 Q58 82 62 77 L109 16";
export const X_PATH = "M56 16 L109 80";

/** Same geometry as polyline control points for 3D tubes (y flipped later) */
export const J_POINTS_3D = {
  segments: [
    { type: "line", from: [10, 12], to: [27, 12] },
    { type: "quad", from: [27, 12], ctrl: [34, 12], to: [34, 19] },
    { type: "line", from: [34, 19], to: [34, 64] },
    { type: "quad", from: [34, 64], ctrl: [34, 82], to: [52, 82] },
    { type: "quad", from: [52, 82], ctrl: [58, 82], to: [62, 77] },
    { type: "line", from: [62, 77], to: [109, 16] },
  ],
} as const;
export const X_POINTS_3D = { from: [56, 16], to: [109, 80] } as const;
