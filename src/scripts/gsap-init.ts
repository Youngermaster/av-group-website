import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

let registered = false;

export function initGsap() {
  if (registered) return { gsap, ScrollTrigger, SplitText, Flip };
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
  gsap.config({ nullTargetWarn: false });
  ScrollTrigger.config({
    // Don't refresh on iOS Safari URL-bar toggle (caused expensive recalc on every scroll-direction flip).
    ignoreMobileResize: true,
  });
  ScrollTrigger.defaults({
    markers: false,
    toggleActions: 'play none none none',
    fastScrollEnd: true,
  });
  registered = true;
  return { gsap, ScrollTrigger, SplitText, Flip };
}

export { gsap, ScrollTrigger, SplitText, Flip };
