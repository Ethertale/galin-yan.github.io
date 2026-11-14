// Global data for the page-frame texture (src/texture.njk -> /textures/lowpoly-v1.svg).
import { lowPoly } from '../_lib/lowpoly.js';

export default {
  frame: lowPoly(18, 10, 1600, 900, 0.04),
};
