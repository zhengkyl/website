import { Book } from "./book";

export default function Page() {
  return (
    <>
      <div>
        <p>
          I am inspired by speed sketch artists on TikTok, street portrait
          hustlers in New York, and of course, Kim Jung Gi. Drawing fast with
          ink— that's what I like.
        </p>
        <p className="my-8 mb-16">
          Below are digital recreations of my sketchbooks. I picked out some of
          the better pages, with a couple stinkers for perspective.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <Section
          title="moleskine sketchbook (red)"
          date="JAN '24 - NOW"
          pages="104 pages 5x8.25in"
        >
          <p>
            This is a nice sketchbook, but buying it was a zero interest rate
            phenomenon.
          </p>
          <Book
            numSheets={6}
            pagesDir="/images/moleskine"
            className="h-[--cover-height] [--cover-height:calc(min(480px,70vw))] [--cover-aspect:7/11] [--cover-radius:5.5%_3.5%] [--page-aspect:69/109] [--page-height:98%] [--page-radius:5.45%_3.45%] [--cover-color:#b91c1c]"
          />
        </Section>
        <Section
          title="muji pocketnote"
          date="JUN - DEC '23"
          pages="368 pages 5.4x7.7in"
        >
          <p>This makes for a terrible sketchbook, perfect for terrible art.</p>
          <Book
            numSheets={7}
            sheetOffsetK={1 / 100}
            spineCurveK={0.51}
            pagesDir="/images/muji"
            className="h-[--cover-height] [--cover-height:calc(min(480px,70vw))] [--cover-aspect:15/22] [--cover-radius:0] [--page-aspect:15/22] [--page-height:100%] [--page-radius:0] [--cover-color:#c7a36f]"
          />
        </Section>
        <Section
          title="pacific arc sketchbook (black)"
          date="FEB - MAY '23"
          pages="128 pages 5.6x8.25in"
        >
          <p>My favorite and first real sketchbook.</p>
          <Book
            numSheets={5}
            sheetOffsetK={1 / 120}
            spineCurveK={0.51}
            pagesDir="/images/pacific_arc"
            className="h-[--cover-height] [--cover-height:calc(min(480px,70vw))] [--cover-aspect:2/3] [--cover-radius:0] [--page-aspect:2/3] [--page-height:100%] [--page-radius:0] [--cover-color:transparent]"
          />
        </Section>
        <Section
          title="kurzgesagt notebook (ocean)"
          date="MAY '22 - FEB '23"
          pages="80 pages 5.8x8.3in"
        >
          <p>This came with a sick dinosaur calendar.</p>
          <p className="text-center font-mono font-light my-2 text-stone-500">
            TO BE SCANNED
          </p>
        </Section>
        <Section
          title="kurzgesagt notebook (ant)"
          date="FEB - MAY '22"
          pages="80 pages 5.8x8.3in"
        >
          <p>This also came with the dinosaur calendar.</p>
          <p className="text-center font-mono font-light my-2 text-stone-500">
            TO BE SCANNED
          </p>
        </Section>
        <Section
          title="xtern notebook"
          date="DEC '21 - FEB '22"
          pages="? pages 5.5x8.5in"
        >
          <p>
            I used this notebook to swat flies infesting our apartment. Here's
            to disposable art!
          </p>
          <p className="text-center font-mono font-light my-2 text-stone-500">
            TO BE SCANNED
          </p>
        </Section>
      </div>
    </>
  );
}

function Section(props) {
  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold font-mono">{props.title}</h2>
          <div className="text-right font-light whitespace-pre">
            {props.date}
          </div>
        </div>
        <p className="font-mono mb-2">{props.pages}</p>
        {props.children}
      </div>
    </>
  );
}
