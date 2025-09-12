// This shim makes BOTH import styles work:
//
//   import Testimonials from "@/components/Testimonials";
//   import { Testimonials } from "@/components/Testimonials";
//
import T, { Testimonials as Named } from "./Testimonials";
export default T;
export { Named as Testimonials };
