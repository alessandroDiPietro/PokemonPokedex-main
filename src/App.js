import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import './App.css';

function App() {
    const number = 10;

    //Object array that contains name and img. It will be populated by the set
    const [pokemon, setPokemon] = useState(null);
    const [inputValue, setInputValue] = useState(0);
    const [pokemonSearch, setPokemonSearch] = useState(null);


    const searchCard = () => {
        if (inputValue > 0) {
            //valid input, doing request
            axios.get(`https://pokeapi.co/api/v2/pokemon/${inputValue}/`).then(response => {
                const searchPokemon = { name: response.data.name, img: `https://pokeres.bastionbot.org/images/pokemon/${response.data.id}.png` }
                setPokemonSearch(searchPokemon);
            });
        }
    }
    const getName = () => {
        const promiseArray = [];
        const casualNum = new Set();
        const pokeArray = [];

        //Generating casual id number for picking casual pokemon from Database.

        while (casualNum.size < number) {
            const pokeId = Math.floor(Math.random() * 200 + 1);
            casualNum.add(pokeId);

        }

        //Cycle to insert into an array the promises generated by the get

        casualNum.forEach(element => {
            const promise = axios.get(`https://pokeapi.co/api/v2/pokemon/${element}/`);
            promiseArray.push(promise);
        })

        //Put every promise into a single promise to print an array of promises result

        Promise.all(promiseArray).then((el) => {

            // console.log("promises", el);
            el.map(response => {
                const nameAssign = response.data.name;
                const pokeObject = { name: nameAssign, img: `https://pokeres.bastionbot.org/images/pokemon/${response.data.id}.png` }
                pokeArray.push(pokeObject);
            })
            setPokemon(pokeArray);
        })

    }

    //useEffect that make getName changing running only one time after on mount/refresh
    useEffect(() => {
        console.log("refresh/started");
        getName();
    }, [])

    //Checking if the object array isn't null

    return (

        <div className="container">
            <h1>My Pokedex</h1>
            <div className="research">
                <input
                    className="pokeInput"
                    type="number"
                    value={inputValue}
                    onChange={e => {
                        console.log('EEE', e.target.value);
                        if (e.target.value > 0) {
                            setInputValue(e.target.value);
                        }
                    }}
                    required
                />
                <Button type="button" className="pokeButton" onClick={searchCard} >Search</Button>
            </div>

            {pokemonSearch &&
                (<div><Card className='pokeCardNew'>
                    <Card.Title className="pokeTitle"> {pokemonSearch.name} </Card.Title>
                    <Card.Img className="pokeImg" src={pokemonSearch.img} />
                </Card></div>)

            }

            {pokemon && (pokemon.map(response => {
                return (<Card className='pokeCard' key={response.name}>
                    <Card.Title className="pokeTitle"> {response.name} </Card.Title>
                    <Card.Img className="pokeImg" src={response.img} />
                </Card>)

            }))
            }


        </div>


    )
}




export default App;