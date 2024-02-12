import {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { StopCircle, Volume2 } from "lucide-react";

export type Button = JSX.Element | string | null;

export type SpeechStatus = "started" | "paused" | "stopped";

export type ChildrenOptions = {
  speechStatus?: SpeechStatus;
  start?: Function;
  pause?: Function;
  stop?: Function;
};

export type Children = (childrenOptions: ChildrenOptions) => ReactNode;

export type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export type SpeechProps = {
  text: string;
  pitch?: number;
  rate?: number;
  volume?: number;
  lang?: string;
  voice?: number;
  startBtn?: Button;
  pauseBtn?: Button;
  stopBtn?: Button;
  useStopOverPause?: boolean;
  //   speechStatus: SpeechStatus;
  //   setSpeechStatus: React.Dispatch<React.SetStateAction<SpeechStatus>>;
  onError?: Function;
  children?: Children;
  props?: Props;
};

const Speech = ({
  text,
  pitch = 1,
  rate = 1,
  volume = 1,
  lang = "",
  voice = 1,
  startBtn = <Volume2 />,
  stopBtn = <StopCircle />,
  useStopOverPause,
  onError = () => alert("Browser not supported! Try some other browser."),
  children,
  props = {},
}: SpeechProps) => {
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>("stopped");
  const [useStop, setUseStop] = useState<boolean>();
  const [mounted, setMounted] = useState(false);
  const synth = window.speechSynthesis;

  const getVoices = () => {
    if (synth) {
      return synth.getVoices();
    }
    return [];
  };

  const voices = getVoices();
  const selectedVoice = voices[1];

  const utterance = new window.SpeechSynthesisUtterance(
    text?.replace(/\s/g, " ")
  );
  utterance.pitch = pitch;
  utterance.rate = rate;
  utterance.volume = volume;
  utterance.lang = lang;
  utterance.voice = selectedVoice;

  const pause = () => speechStatus !== "paused" && synth?.pause();
  const stop = () => speechStatus !== "stopped" && synth?.cancel();

  const start = () => {
    if (!synth) return onError();

    setSpeechStatus("started");
    if (speechStatus === "paused") return synth.resume();
    if (synth.speaking) synth.cancel();

    function setStopped() {
      setSpeechStatus("stopped");
      utterance.onpause = null;
      utterance.onend = null;
      utterance.onerror = null;
      if (synth.paused) synth.cancel();
    }

    utterance.onpause = () => setSpeechStatus("paused");
    utterance.onend = setStopped;
    utterance.onerror = setStopped;
    synth.speak(utterance);
  };

  const speech = async () => {
    return new Promise<void>((resolve) => {
      if (speechStatus !== "started") {
        start();
      } else if (useStop === false) {
        pause();
      } else {
        stop();
      }

      // Resolve the promise after a short delay to ensure the speech has started/paused/stopped
      setTimeout(() => {
        resolve();
      }, 100);
    });
  };

  useEffect(() => {
    handleClick();
  }, [text]);

  const handleClick = async () => {
    // Trigger speech and wait for it to start
    await speech();

    // Set useStop to false once speech has started
    setUseStop(false);
  };

  useEffect(() => {
    setUseStop(
      useStopOverPause ?? ((navigator as any).userAgentData?.mobile || false)
    );

    // If the component is mounted, initialize speech
    if (mounted) {
      window.speechSynthesis?.cancel();
      start();
    } else {
      // Mark the component as mounted after the first render
      setMounted(true);
    }

    return () => {
      // Cleanup any potential remaining event listener
      window.removeEventListener("voiceschanged", () => {});
    };
  }, [voice, mounted]);

  return typeof children === "function" ? (
    children({ speechStatus, start, pause, stop })
  ) : (
    <div style={{ display: "inline", width: "30px" }} {...props}>
      {speechStatus !== "started" ? (
        <span role="button" onClick={handleClick}>
          {startBtn}
        </span>
      ) : (
        <span role="button" onClick={stop}>
          {stopBtn}
        </span>
      )}
    </div>
  );
};

export default Speech;
