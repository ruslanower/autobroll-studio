import { ProjectData } from '@/types';

/**
 * Escape XML special characters to prevent parser and DTD errors
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate Apple Final Cut Pro 7 / Adobe Premiere Pro XML format (xmeml v5)
 */
export function generatePremiereXML(project: ProjectData): string {
  const fps = 30;
  const timebase = fps;
  const totalFrames = Math.max(1, Math.round(project.audioDuration * fps));
  const width = project.aspectRatio === '9:16' ? 1080 : 1920;
  const height = project.aspectRatio === '9:16' ? 1920 : 1080;

  const clipItems = project.clips.map((clip, index) => {
    const inFrame = 0;
    const outFrame = Math.max(1, Math.round(clip.duration * fps));
    const startFrame = Math.round(clip.startTime * fps);
    const endFrame = Math.round(clip.endTime * fps);
    const escapedTitle = escapeXml(clip.title);
    const escapedPrompt = escapeXml(clip.promptOrKeyword);
    const escapedUrl = escapeXml(clip.videoUrl);

    return `        <clipitem id="clipitem-${index + 1}">
          <name>${escapedTitle}</name>
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
            <name>${escapedTitle}.mp4</name>
            <pathurl>${escapedUrl}</pathurl>
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
            <description>AutoB-Roll Scene: ${escapedPrompt}</description>
            <scene>${index + 1}</scene>
          </logginginfo>
        </clipitem>`;
  }).join('\n');

  const escapedProjectTitle = escapeXml(project.title);
  const escapedAudioUrl = escapeXml(project.audioUrl);

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="5">
  <sequence id="sequence-1">
    <name>${escapedProjectTitle} [AutoB-Roll VanzaLabs]</name>
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
              <pathurl>${escapedAudioUrl}</pathurl>
            </file>
          </clipitem>
        </track>
      </audio>
    </media>
  </sequence>
</xmeml>`;
}

/**
 * Generate Apple Final Cut Pro XML (.fcpxml v1.9 / v1.10)
 * Strictly compliant with Apple FCPXML DTD specification:
 * - <!ELEMENT asset (media-rep+ , metadata?)>
 * - Asset contains <media-rep kind="original-media" src="..." /> instead of src attribute on <asset>
 * - Sequential clips in <spine>
 */
export function generateFCPXML(project: ProjectData): string {
  const fps = 30;
  const width = project.aspectRatio === '9:16' ? 1080 : 1920;
  const height = project.aspectRatio === '9:16' ? 1920 : 1080;
  const totalSeconds = project.audioDuration;
  const totalDurationFraction = `${Math.round(totalSeconds * 1000)}/1000s`;

  // Define asset resources compliant with DTD <!ELEMENT asset (media-rep+, metadata?)>
  const resources = project.clips.map((clip, idx) => {
    const durFraction = `${Math.round(clip.duration * 1000)}/1000s`;
    const escapedTitle = escapeXml(clip.title);
    const escapedUrl = escapeXml(clip.videoUrl);

    return `    <asset id="r${idx + 2}" name="${escapedTitle}" duration="${durFraction}" format="r1" hasVideo="1">
      <media-rep kind="original-media" src="${escapedUrl}" />
    </asset>`;
  }).join('\n');

  // Spine clips: in FCPXML spine, items are arranged in story order without gaps.
  const spineClips = project.clips.map((clip, idx) => {
    const durFraction = `${Math.round(clip.duration * 1000)}/1000s`;
    const offsetFraction = `${Math.round(clip.startTime * 1000)}/1000s`;
    const escapedTitle = escapeXml(clip.title);

    // If it's the first clip, attach the voiceover audio asset as connected clip on lane -1
    if (idx === 0) {
      return `          <asset-clip name="${escapedTitle}" ref="r${idx + 2}" offset="${offsetFraction}" duration="${durFraction}" start="0s" format="r1">
            <asset-clip name="Voiceover Audio" ref="r_audio" lane="-1" offset="${offsetFraction}" duration="${totalDurationFraction}" start="0s" audioRole="dialogue" />
          </asset-clip>`;
    }

    return `          <asset-clip name="${escapedTitle}" ref="r${idx + 2}" offset="${offsetFraction}" duration="${durFraction}" start="0s" format="r1" />`;
  }).join('\n');

  const escapedProjectTitle = escapeXml(project.title);
  const escapedAudioUrl = escapeXml(project.audioUrl);

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.9">
  <resources>
    <format id="r1" name="FFVideoFormat${width}x${height}p${fps}" frameDuration="1/${fps}s" width="${width}" height="${height}" colorSpace="1-1-1 (Rec. 709)" />
    <asset id="r_audio" name="Voiceover" duration="${totalDurationFraction}" hasAudio="1" audioSources="1" audioChannels="2" audioRate="48000">
      <media-rep kind="original-media" src="${escapedAudioUrl}" />
    </asset>
${resources}
  </resources>
  <library>
    <event name="AutoB-Roll Studio Events">
      <project name="${escapedProjectTitle}">
        <sequence format="r1" duration="${totalDurationFraction}" tcStart="0s" tcFormat="NDF">
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
    const totalFrames = Math.max(0, Math.floor(seconds * fps));
    const hrs = Math.floor(totalFrames / (3600 * fps));
    const mins = Math.floor((totalFrames % (3600 * fps)) / (60 * fps));
    const secs = Math.floor((totalFrames % (60 * fps)) / fps);
    const frms = totalFrames % fps;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}:${pad(frms)}`;
  }

  const cleanTitle = project.title.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 30).toUpperCase();
  let edl = `TITLE: ${cleanTitle || 'AUTOBROLL'}\nFCM: NON-DROP FRAME\n\n`;

  project.clips.forEach((clip, index) => {
    const num = (index + 1).toString().padStart(3, '0');
    const srcIn = toTC(0);
    const srcOut = toTC(clip.duration);
    const recIn = toTC(clip.startTime);
    const recOut = toTC(clip.endTime);

    edl += `${num}  AX       V     C        ${srcIn} ${srcOut} ${recIn} ${recOut}\n`;
    edl += `* FROM CLIP NAME: ${clip.title.replace(/[^a-zA-Z0-9_]/g, '_')}.mp4\n`;
    edl += `* SCENE PROMPT: ${clip.promptOrKeyword.replace(/[\r\n]/g, ' ')}\n\n`;
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
