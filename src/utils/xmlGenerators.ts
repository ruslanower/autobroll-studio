import { ProjectData } from '@/types';

/**
 * Generate Apple Final Cut Pro 7 / Adobe Premiere Pro XML format
 */
export function generatePremiereXML(project: ProjectData): string {
  const fps = 30;
  const timebase = fps;
  const totalFrames = Math.round(project.audioDuration * fps);
  const width = project.aspectRatio === '9:16' ? 1080 : 1920;
  const height = project.aspectRatio === '9:16' ? 1920 : 1080;

  const clipItems = project.clips.map((clip, index) => {
    const inFrame = 0;
    const outFrame = Math.round(clip.duration * fps);
    const startFrame = Math.round(clip.startTime * fps);
    const endFrame = Math.round(clip.endTime * fps);

    return `
        <clipitem id="clipitem-${index + 1}">
          <name>${clip.title}</name>
          <duration>${outFrame}</duration>
          <rate>
            <timebase>${timebase}</timebase>
            <ntsc>FALSE</ntsc>
          </rate>
          <start>${startFrame}</start>
          <end>${endFrame}</end>
          <in>${inFrame}</in>
          <out>${outFrame}</out>
          <file id="file-${index + 1}">
            <name>${clip.title}.mp4</name>
            <pathurl>${clip.videoUrl}</pathurl>
            <rate>
              <timebase>${timebase}</timebase>
            </rate>
            <duration>${outFrame}</duration>
            <media>
              <video>
                <samplecharacteristics>
                  <width>${width}</width>
                  <height>${height}</height>
                </samplecharacteristics>
              </video>
            </media>
          </file>
          <logginginfo>
            <description>AutoB-Roll Studio Scene: ${clip.promptOrKeyword} (${clip.sourceType.toUpperCase()})</description>
            <scene>${index + 1}</scene>
          </logginginfo>
        </clipitem>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="5">
  <sequence id="sequence-1">
    <name>${project.title} [AutoB-Roll VanzaLabs]</name>
    <duration>${totalFrames}</duration>
    <rate>
      <timebase>${timebase}</timebase>
      <ntsc>FALSE</ntsc>
    </rate>
    <media>
      <video>
        <format>
          <samplecharacteristics>
            <width>${width}</width>
            <height>${height}</height>
            <pixelaspectratio>square</pixelaspectratio>
            <rate>
              <timebase>${timebase}</timebase>
            </rate>
          </samplecharacteristics>
        </format>
        <track>
${clipItems}
        </track>
      </video>
      <audio>
        <track>
          <clipitem id="audio-voiceover">
            <name>Voiceover Audio</name>
            <duration>${totalFrames}</duration>
            <start>0</start>
            <end>${totalFrames}</end>
            <in>0</in>
            <out>${totalFrames}</out>
            <file id="file-audio-main">
              <name>Voiceover.mp3</name>
              <pathurl>${project.audioUrl}</pathurl>
            </file>
          </clipitem>
        </track>
      </audio>
    </media>
  </sequence>
</xmeml>`;
}

/**
 * Generate Final Cut Pro X XML (.fcpxml)
 */
export function generateFCPXML(project: ProjectData): string {
  const fps = 30;
  const width = project.aspectRatio === '9:16' ? 1080 : 1920;
  const height = project.aspectRatio === '9:16' ? 1920 : 1080;
  const totalSeconds = project.audioDuration;

  const spineClips = project.clips.map((clip, idx) => {
    const durFraction = `${Math.round(clip.duration * 1000)}/1000s`;
    const offsetFraction = `${Math.round(clip.startTime * 1000)}/1000s`;

    return `          <asset-clip name="${clip.title}" ref="r${idx + 2}" offset="${offsetFraction}" duration="${durFraction}" start="0s" />`;
  }).join('\n');

  const resources = project.clips.map((clip, idx) => {
    return `    <asset id="r${idx + 2}" name="${clip.title}" src="${clip.videoUrl}" duration="${Math.round(clip.duration * 1000)}/1000s" hasVideo="1" format="r1" />`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.9">
  <resources>
    <format id="r1" name="FFVideoFormat${width}x${height}p${fps}" frameDuration="1/${fps}s" width="${width}" height="${height}" />
    <asset id="r_audio" name="Voiceover" src="${project.audioUrl}" duration="${Math.round(totalSeconds * 1000)}/1000s" hasAudio="1" />
${resources}
  </resources>
  <library>
    <event name="AutoB-Roll Studio Events">
      <project name="${project.title}">
        <sequence format="r1" duration="${Math.round(totalSeconds * 1000)}/1000s">
          <spine>
${spineClips}
          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>`;
}

/**
 * Generate CMX 3600 EDL for DaVinci Resolve
 */
export function generateDaVinciEDL(project: ProjectData): string {
  const fps = 30;

  function toTC(seconds: number): string {
    const totalFrames = Math.floor(seconds * fps);
    const hrs = Math.floor(totalFrames / (3600 * fps));
    const mins = Math.floor((totalFrames % (3600 * fps)) / (60 * fps));
    const secs = Math.floor((totalFrames % (60 * fps)) / fps);
    const frms = totalFrames % fps;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}:${pad(frms)}`;
  }

  let edl = `TITLE: ${project.title.substring(0, 30).toUpperCase()}\nFCM: NON-DROP FRAME\n\n`;

  project.clips.forEach((clip, index) => {
    const num = (index + 1).toString().padStart(3, '0');
    const srcIn = toTC(0);
    const srcOut = toTC(clip.duration);
    const recIn = toTC(clip.startTime);
    const recOut = toTC(clip.endTime);

    edl += `${num}  AX       V     C        ${srcIn} ${srcOut} ${recIn} ${recOut}\n`;
    edl += `* FROM CLIP NAME: ${clip.title}.mp4\n`;
    edl += `* SCENE PROMPT: ${clip.promptOrKeyword}\n\n`;
  });

  return edl;
}

/**
 * Trigger file download directly in browser
 */
export function triggerDownload(filename: string, content: string, contentType: string = 'text/plain') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
