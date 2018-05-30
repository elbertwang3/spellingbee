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
    const files = ["data/2018spellers.json", "data/results.csv", "data/levenshtein.csv", "https://d3js.org/us-10m.v1.json"]
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
                <div className="subhed">On the nation's youngest, cutest spelling wizards and the bewildering words that they spell</div>
                <div className="byline">by <a href="https://twitter.com/elbertwang1"><strong>Elbert Wang</strong></a></div>
              </div>
            
          
            </section>
            <section className="step">
              <p className="prose">
                Every May after Memorial Day, the nation’s best spellers descend upon Washington D.C. for a chance to take 
                home the title of nation's best speller. All of the qualifiers have made it to the national bee by winning a regional bee 
                spanning several counties, with some representing an entire state or territory. The competition is based on Merriam Webster's
                unabridged Third New International Dictionary, which includes some 470,000 entries, and spellers can be tested on any
                word from it. As 2011 winner Sukanya Roy tells me, "Trying to memorize all the words from scratch is impossible, 
                so spellers often use study lists as a starting point, using definitions, etymologies, and roots to put together words. 
                It’s a really strategic process.”
              </p>
              <p className="prose">
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
              </p>
          
            </section>
            <section className="step">
              <p className="prose">
                In previous years there were
                around 300 participants, but this year 500 have qualified, a change in the rules that has allowed more spellers
                a chance in competitive a districts a chance at the title. Here are all 500 spellers.
              </p>
          
            </section>
            <section className="step">
              <p className="prose">
                400 or whateva of these spellers are FIRST-TIMERS, VIRGINS, NEWBIES, whateva u wanna call em. However, 100 of 
                these are return spellers. The winners are usually NOT first timers, as experience helps them. Last year's winner
                Nihar Janga was a first-timer, however, but he didn't come out of nowhere. He came in 2nd at 2015 NSF spelling bee,
                which is a sort of minor league for spellers. Most past winners in recent memory were return winners.

              </p>
          
            </section>
            <section className="step">
              <p className="prose">
                A handful have participated three times
              </p>
          
            </section>
            <section className="step">
              <p className="prose">
               This is Tara Singh's FOURTH spelling bee, y'all, and it's gonna be her last. The rules say that you cannot be 
               in 8th grade or younger, and younger than 15. She's in the 8th grade. And she placed 18th last year. We'll see how 
               far she can go this year, or if she can take home the title.
              </p>
          
            </section>
            <section className="step">
              <p className="prose">
                Of those who have returned, this is their best placement. Three spellers have placed 7th--they are considered 
                the front-runners usually.
              </p>
          
            </section>
            <section className="step">
              <p className="prose">
                Most spellers are around 13ish, but some are super super young, like Akash Vukokti and Edith! LOL!
                Here's how their ages are distributed
              </p>
          
            </section>
            <section className="step">
              <p className="prose">
                And here's where they're from
              </p>
          
            </section>
            <section className="step">
             
          
            </section>
          </div>
        </div>
        <div className="second">
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





        </div>
      </div>
    );
  }
}

export default App;
