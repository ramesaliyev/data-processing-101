let db = null;

import {fetchHDFSRead} from './api';

export async function prepareDB() {
  if (!db) {
    db = {};

    const [movies, links] = await Promise.all([
      fetchHDFSRead('/movielens/movies.csv'),
      fetchHDFSRead('/movielens/links.csv')
    ]);

    db.movies = movies.slice(1);
    db.links = links.slice(1);
  }
}

export function getMovieById(id) {
  const movie = db.movies.find(m => m.startsWith(`${id},`));
  const links = db.links.find(m => m.startsWith(`${id},`));
  
  const [movieId,title,genres] = movie.split(',');
  const [,imdbId,tmdbId] = links.split(',');

  return {
    movieId,
    title,
    genres,
    imdbId,
    tmdbId
  }
}