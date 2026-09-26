/**
 * The scene graph. Each <Frame> holds content authored in that frame's units
 * (see src/journey/layout.ts). Sky layers are attached to the camera.
 */
import { Frame } from './Director';
import { AsteroidBelt } from './scenes/AsteroidBelt';
import { DeepRocket } from './scenes/DeepRocket';
import { Earth } from './scenes/Earth';
import { Galaxy } from './scenes/Galaxy';
import { Heliosphere } from './scenes/Heliosphere';
import { LaunchSite } from './scenes/LaunchSite';
import { LocalGroup } from './scenes/LocalGroup';
import { Moon } from './scenes/Moon';
import { NearbyStars } from './scenes/NearbyStars';
import { OortCloud } from './scenes/OortCloud';
import { Planets } from './scenes/Planets';
import { Rocket } from './scenes/Rocket';
import { Sky } from './scenes/Sky';
import { Sun } from './scenes/Sun';
import { SunStar } from './scenes/SunStar';

export function World() {
  return (
    <>
      <Sky />
      <Frame id="earth">
        <LaunchSite />
        <Rocket />
        <Earth />
        <Moon />
      </Frame>
      <Frame id="sol">
        <Sun />
        <Planets />
        <AsteroidBelt />
        <Heliosphere />
        <DeepRocket />
      </Frame>
      <Frame id="local">
        <SunStar />
        <OortCloud />
        <NearbyStars />
      </Frame>
      <Frame id="galaxy">
        <Galaxy />
      </Frame>
      <Frame id="group">
        <LocalGroup />
      </Frame>
    </>
  );
}
