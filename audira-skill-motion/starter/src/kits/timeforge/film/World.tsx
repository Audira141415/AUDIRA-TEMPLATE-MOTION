import { useLayoutEffect, useRef } from "react";
import type { Group } from "three";
import type { Tree } from "../morph/lerpTree.ts";
import { CameraRig, Post } from "../../../core/render/Post.tsx";
import { Studio } from "../../../core/studio/Studio.tsx";
import type { FilmState } from "./choreography.ts";
import type { Subject } from "./subject.ts";

/** The whole physical scene for one frame of state: studio, the posed object, its extras, camera, post. */
export const World = <P extends Tree, Fx extends Record<string, number>>({ subject, s, frame, font }: { subject: Subject<P, Fx>; s: FilmState<P, Fx>; frame: number; font: string }) => {
  const object = useRef<Group>(null);
  useLayoutEffect(() => {
    object.current!.matrix.copy(s.pose.matrix);
    object.current!.matrixWorldNeedsUpdate = true;
  });
  const { Model, Extras } = subject;
  return (
    <>
      <Studio look={s.look} blob={s.blob} />
      <group ref={object} matrixAutoUpdate={false}>
        <Model era={s.era} sweep={s.sweep} font={font} fx={s.fx} />
      </group>
      {Extras ? <Extras s={s} font={font} /> : null}
      <CameraRig shot={s.shot} />
      <Post shot={s.shot} frame={frame} aoRadius={0.45} />
    </>
  );
};
