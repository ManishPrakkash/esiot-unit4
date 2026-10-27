import type { Slide } from "../types";
import { introSlides } from "./u4-s01-cover";
import { gsmHardwareSlides } from "./u4-s02-gsm";
import { gsmAppSlides } from "./u4-s03-gsm-apps";
import { cloudIntroSlides } from "./u4-s04-cloud-intro";
import { cloudArchSlides } from "./u4-s05-cloud-arch-services";
import { protocolSlides } from "./u4-s06-protocols";
import { adafruitSlides } from "./u4-s07-adafruit";
import { recapSlides } from "./u4-s08-recap-quiz";

export const slides: Slide[] = [
  ...introSlides,
  ...gsmHardwareSlides,
  ...gsmAppSlides,
  ...cloudIntroSlides,
  ...cloudArchSlides,
  ...protocolSlides,
  ...adafruitSlides,
  ...recapSlides,
];
