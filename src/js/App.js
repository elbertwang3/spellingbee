import React, { Component } from 'react';
import '../css/App.css';
import Coordinator from './components/Coordinator.js';
import dremiologo from '../images/dremiologo.svg';
import * as d3 from 'd3';
import ReactGA from 'react-ga';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      profileimages: null,
      spellers: null,
      results: null,
      levenshtein: null,
    };

    ReactGA.initialize('UA-92535580-1');
    ReactGA.pageview(window.location.pathname + window.location.search);

  }

   importAllImages(r) {

    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  componentWillMount() {
    const images = this.importAllImages(require.context('../images/spellers', false, /\.(png)$/));
    this.setState({profileimages: images})

  }

  componentDidMount() {
    const files = ["data/2018spellers.json", "data/results.csv", "data/levenshtein.csv", "data/us.json"]
    const types = [this.type3, this.type, this.type2, this.type]
    const csvPattern = new RegExp(".csv$")
    const jsonPattern = new RegExp(".json$")
    Promise.all(files.map((url,i) => {
      if (csvPattern.test(url)) {
        return d3.csv(url, types[i].bind(this))
      } else if (jsonPattern.test(url)) {
        return d3.json(url)
      } else {
         return d3.tsv(url, types[i].bind(this))
      }
    })).then(values => {
      this.setState({
        spellers: values[0],
        results: values[1],
        levenshtein: values[2],
        usmap: values[3]
      })
    })
  }

  type(d) {
    return d
  }

  type2(d) {
    d['frequency'] = +d['frequency']
    return d
  }

 

  render() {
    const {profileimages, spellers, results, levenshtein, usmap} = this.state
    let coordinator
    if (profileimages && spellers) {
      coordinator = <Coordinator profileimages={profileimages} data={spellers} us={usmap}/>
    }
    return (
      <div className="content">
        <div className='graphic' id='graphic1'>
          <div className="viz" id="viz1">
            {coordinator}
          </div>
          <div className='sections' id='sections1'>

            <section className="step">

              <div className="intro">
                 <a href="https://www.dremio.com/" target="_blank" rel="noopener noreferrer" className="logo"> <img src={dremiologo} height="40" alt="dremio-logo"/></a>
                <div className="title"><h1>The Bee</h1></div>
                <div className="subhed">A preview of the contestants and frontrunners from 2018 Scripps National Spelling Bee</div>
                <div className="byline">by <a href="https://twitter.com/elbertwang1"><strong>Elbert Wang</strong></a></div>
              </div>
            
          
            </section>
            <section className="step">
              <p className="prose dark">
                Every May after Memorial Day, the nation’s best spellers descend upon Oxon Hill, MD, just outside the capital, for a chance to take 
                home the title of nation's best speller. Here's where they're from. All of the qualifiers have made it to the national bee by 
                winning a regional bee spanning several counties, and some have come from outside the U.S., with Canada, 
                Ghana, Italy, Jamaica, Japan, South Korea, and the UK represented this year.
              
              </p>
               <p className="prose dark">
                The competition is based on Merriam Webster's unabridged Third New International Dictionary, which includes some 470,000 
                entries, from which spellers can be tested on any word. As 2011 winner Sukanya Roy tells me, "Trying to memorize all 
                the words from scratch is impossible, so spellers often use study lists as a starting point, using definitions, etymologies, 
                and roots to put together words. It’s a really strategic process.”
              </p>
          
            </section>
            <section className="step">

             
              {/*<p className="prose">
                At the National Bee, the first round is a preliminary test administered by a computer. In recent years, the test 
                format has changed, now incorporating a vocabulary section to test the spellers’ true knowledge of the words rather 
                than a rote memorization of their spellings. The subsequent two rounds are oral, in which spellers take to the stage 
                and are given a word from pre-distributed study guides. During the oral rounds, spellers are allowed to ask the 
                pronouncer for the word’s definition, part of speech, use in a sentence, language of origin, alternate pronunciation(s), 
                and whether the word contains a specific root. Their score is aggregated, determining whether they make it to the Semifinals. 
                The Semifinals consists of another computer-administered spelling and vocabulary test and two more oral rounds, 
                where the words do not come from a study list. ESPN starts its broadcast with these two oral rounds and airs all subsequent 
                rounds live. These oral rounds have provided me with all the data I need to figure out what makes a champion and the
                words it took to get there. This is a story of this year's spellers, and the words previous spellers were faced with.
              </p>*/}
              <p className="prose dark">
                In previous years, around 300 spellers would qualify for the Bee, but due to a change in the rules 
                that has allowed more spellers in competitive districts to qualify, 519 spellers will vie for the title
                this year. Here are all the spellers.
              </p>
          
          
            </section>
            <section className="step">
              <p className="prose dark">For Speller No. 153, Atman Balakrishnan, spelling runs in the family.
              Thirty-five years ago, his father Balu Natarajan won the 1985 Bee with "milieu." Natarajan was the first Indian-American
              to win the Bee, inspiring a generation of Indian-American families to take up spelling as an academic challenge.
              </p>
                <p className="prose dark">Siblings
              have both won the Bee (Vanya and Kavya Shivashankar and Sriram and Jairam Hathwar), but this year,
              Atman will get the chance to be the first father-son duo.
              </p>
            </section>
            <section className="step">
              <p className="prose dark">
                Of all of the contestants, 405 are participating for the first time, and the remaining 114 have at least one Bee under
                their belt. Most winners in recent memory have been return participants. It took Vanya five tries, but she finally won in 2015 on her 
                last year of eligibility. Spellers must be 
                in the 8th grade or below and no older than 15 in order to participate. 2016 winner Nihar Janga won on his first try, which
                hadn't been done since 2002, but he didn't come out of nowhere. He came in 2nd at North South Foundation Bee the previous year, a sort of minor league
                for Indian-American spellers. 

              </p>
          
            </section>
            <section className="step">
            
          
            </section>
             <section className="step">
            
          
            </section>
            <section className="step">
              <p className="prose dark">
               This is Tara Singh's fourth and final spelling bee. She's improved every single year, placing 18th in 2017. We'll see 
                if she can go even further this year and potentially take home the title.
              </p>
          
            </section>
            <section className="step">
              <p className="prose dark">
                Of those who have returned, these are their best placements. Three spellers, Naysa Modi, Erin Howard, and Shruthika Padhy,
                all placed 7th last year. They will be front-runners at this year's Bee. 
              </p>
          
            </section>
            <section className="step">
              <p className="prose dark">
                Most spellers and winners are around 13. This year's youngest contestants, Sivasaipraneethreddy Devireddy and Akash
                Vukoti, are 8. Two years  ago, Akash became the youngest ever qualifier for the Bee at 6 years old. Nihar became the youngest
                winner in 2016, at 11 years old.
              </p>
          
            </section>         
          </div>
          
        </div>

        {/*<div className="second">
          <h2> The Words</h2>
          <p className="prose regular">
            These are word lengths. Longer isn't necessarily harder, y'all. But shorter words are tricky. Three words were 
            3 letters long, but two, ___ and ____, were spelled incorrectly
          </p>
          <p className="prose regular">
            Here's where the words are from. Most are Latin and Middle English. Hebrew, however, is more tricky
          </p>
          <p className="prose regular">
            I decided to use Levenshtein edit distance algorithm to see what mistakes they were making
            How many letters off were you??
          </p>
          <p className="prose regular">
            And what were the most common mistakes? It turns out the most common mistakes are all SCHWA mistakes. WOW.
            and double letters, and the "ch" sound are also tricky.
          </p>
          <p className="prose regular">
            And here is every single last word in the spelling bee, like ever. Mouse over to explore, or filter and do
            other shit to it. lol!
          </p>





        </div>*/}
        <div className="conclusion">  <p className="prose">
        Aside from a love of words, what brings me back to the Bee year after year
        is the youth of the spellers. The Bee gives us a veritable collection of the nation's most adorable 
        young spelling wizards, which includes cherubic <a href="https://www.youtube.com/watch?v=bAOoFGCh1eY">Akash</a>, who 
        can spell pneumonoultramicroscopicsilicovolcanoconiosis and melt your cold, jaded heart while doing so.
        The kids have personality, they have poise, and they have been so devoted to the practice of spelling--and there is no pastime more 
        American or wholesome--that they have made it to the national competition. The Bee becomes a panacea for all things bad, like covfefe,
        autocorrect, and the constant negative attacks on the press, giving us hope for the next generation, and a reminder that
        good things do come in small packages.</p>

        </div>
        <div className="credits-container">
          <div className="credits">
                <h3> Credits and Methodology </h3>
                <p className="creditsp">
                  Bee graphic made using <a href="https://twitter.com/alizauf">Aliza Aufrichtig's</a> <a href="https://spotify.github.io/coordinator/"
                  >Coördinator</a>. Analysis done using <a href="https://www.dremio.com/">Dremio</a> and Python. Created using d3.js and <a href="https://github.com/facebook/create-react-app">create-react-app</a>.
                   Data is scraped from the Scripps <a href="http://spellingbee.com/">website</a> and from <a href="https://twitter.com/octonion"> Christopher Long's</a> <a href="https://github.com/octonion/spelling">github repository</a>. 
                </p>
              </div>
            </div>
      </div>
    );
  }
}

export default App;
