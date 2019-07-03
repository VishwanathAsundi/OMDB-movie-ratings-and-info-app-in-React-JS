import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import ReactStars from 'react-stars'
import isImageUrl from 'is-image-url';

const options = [
    { value: 'movie', label: 'Movies' },
    { value: 'series', label: 'Series' },
    { value: 'episode', label: 'Episode' },
];
class Posts extends Component {
    state = {
        selectedOption: 'Search by Type',
        search: 'Batman',
        movieData: [],
        type: 'movie',
        rating: null,
        year: null,
        loader: true,
        data: {}
    }
    componentDidMount() {
        this.getData(this.state.search, this.state.type, this.state.year);
    }
    searchHandler = (e) => {
        if (e.target.value !== '') {
            this.setState({ search: e.target.value });
            this.getData(e.target.value, this.state.type, this.state.year);
        }
        else {
            this.getData('Batman', this.state.type, this.state.year);
        }

    }
    getData = (search, type, year) => {
        this.setState({ loader: true });
        let url = `http://www.omdbapi.com/?s=${search}&apikey=505b30a5&type=${type}&y=${year}`;
        axios.get(url)
            .then(res => {
                console.log(res);
                this.setState({ movieData: res.data.Search, loader: false });
                return res;
            }).catch((error) => console.log(error))
    }
    handleChange = (e) => {
        this.setState({ type: e.value, selectedOption: e.label });
        this.getData(this.state.search, e.value, this.state.year);
    };
    ratingChanged = (newRating) => {
        console.log(newRating);
    }
    yearHandler = (e) => {
        console.log(e.target.value);
        this.setState({ year: e.target.value });
        this.getData(this.state.search, this.state.type, e.target.value);
    }
    getRatings = async (id) => {
        let url = `http://www.omdbapi.com/?i=${id}&apikey=505b30a5`;
        axios.get(url)
            .then(res => {
                this.setState({ data: res.data });
                return res;
            }).catch((error) => console.log(error))
    }

    render() {
        const { movieData, selectedOption, data } = this.state;
        return (
            <div className="set-bg">
                <div className="container">
                    <div className="header">
                        <div className="row">
                            <div className="col-md-4 col-sm-12 col-xs-12">
                                <div className="form-group mb-0 my-2">
                                    <input type="text"
                                        placeholder="Search with Movie Name"
                                        className="form-control"
                                        onChange={(e) => this.searchHandler(e)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-12 col-xs-12">
                                <div className="form-group mb-0 my-2 ">
                                    <Select
                                        placeholder={selectedOption}
                                        value={selectedOption}
                                        onChange={(e) => this.handleChange(e)}
                                        options={options}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-12 col-xs-12">
                                <div className="form-group mb-0 my-2">
                                    <input type="text"
                                        placeholder="Year of Release"
                                        className="form-control"
                                        onChange={(e) => this.yearHandler(e)}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="posts">
                        <div className="row">
                            {
                                this.state.loader ?
                                    <div className="loader">
                                        <img src="/images/Spinner-1s-200px.gif" />
                                        <p>Loading Please wait...</p>
                                    </div>
                                    :
                                    (movieData ? (movieData.map((movie) => {
                                        return (
                                            <div key={movie.imdbID} className="col-lg-4 col-md-4 col-sm-6 col-xs-12 col-12">
                                                <div className="movie-post bounceIn">
                                                    <div className="image-box">
                                                        {(isImageUrl(movie.Poster) ?

                                                            <img
                                                                src={movie.Poster} width="100%" height="100%" alt="movie poster" />

                                                            :
                                                            <img
                                                                src="/images/dummy-image.jpg"
                                                                width="100%" height="100%" alt="alternate poster" />
                                                        )}

                                                    </div>
                                                    <div className="info fade-out">
                                                        <h6 className="title">{movie && movie.Title}</h6>
                                                        <h6>Year of Release : {movie.Year}</h6>
                                                        <p className={(data.imdbID === movie.imdbID) ? "d-none" : "show-more"} onClick={(e) => this.getRatings(movie.imdbID)}>Show More</p>
                                                        {(data.imdbID === movie.imdbID) ?
                                                            <div className="show-details fadeInDown">
                                                                <div className="float-left">
                                                                    <h6>Votes : <span className="content">{data.imdbVotes}</span></h6>
                                                                </div>
                                                                <div className="clearfix"></div>
                                                                <h6 className="pt-1">IMDB Rating : <span className="content">{data.imdbRating}/10</span></h6>
                                                                <h6 className="pt-1">{data.Genre}</h6>
                                                                <h6 className="pt-1">Actors :</h6><span className="content">{data.Actors}</span>
                                                                <div className="ratings">
                                                                    <ReactStars
                                                                        count={5}
                                                                        onChange={(e) => this.ratingChanged(e)}
                                                                        size={24}
                                                                        color2={'#ffd700'}
                                                                    />
                                                                </div>
                                                            </div>
                                                            : ''
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }))
                                        :
                                        <div className="error-msg">
                                            <img src="/images/empty_result.png" />
                                        </div>
                                    )}

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}



export default (Posts);