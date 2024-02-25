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
          Below are digital recreations of my sketchbooks, with some sample
          pages.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <Section
          title="moleskine sketchbook (red)"
          date="JAN '24 - NOW"
          pages="104 pages 5x8.25in"
        >
          <p>
            I bought this from an art supply store while in New York. That's a
            zero interest rate phenomenon.
          </p>
          <Book
            className="h-[--book-height] mb-16 [--book-height:calc(min(480px,70vw))]"
            pagesDir="/images/moleskine"
          />
        </Section>
        <Section
          title="muji pocketnote"
          date="JUN - DEC '23"
          pages="368 pages 5.4x7.7in"
        >
          <p>This makes for a terrible sketchbook, perfect for terrible art.</p>
          <p className="text-center font-mono font-light my-2 text-stone-500">
            TO BE SCANNED
          </p>
        </Section>
        <Section
          title="pacific arc sketchbook (black)"
          date="FEB - MAY '23"
          pages="128 pages 5.6x8.25in"
        >
          <p>
            Only 2 were in stock at the University Book Store. I should've
            bought both.
          </p>
          <p className="text-center font-mono font-light my-2 text-stone-500">
            TO BE SCANNED
          </p>
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
      <div>
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
