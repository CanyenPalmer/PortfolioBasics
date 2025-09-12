// Supports BOTH import styles:
//
//   import Testimonials from "@/components/Testimonials";
//   import { Testimonials } from "@/components/Testimonials";
//
// NOTE: index.ts is inside the "Testimonials" folder,
// but the component file lives one level up at src/components/Testimonials.tsx
import T, { Testimonials as Named } from "../Testimonials";

export default T;
export { Named as Testimonials };
