const input = document.querySelector('.input');

const movie = document.querySelector('.movie');
const div_movies = document.querySelector('.movies');
const paginaAnterior = document.querySelector('.btn-prev');
const proximaPagina = document.querySelector('.btn-next');

const highlightVideo = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');
const highlightVideoLink = document.querySelector('.highlight__video-link');

const modal = document.querySelector('.modal');
const modal_title = document.querySelector('.modal__title');
const modal_img = document.querySelector('.modal__img');
const modal_description =  document.querySelector('.modal__description');
const modal_average = document.querySelector('.modal__average');
const closeModal = document.querySelector('.modal__close');
const modal_genres = document.querySelector('.modal__genres');
const modal_genre_average = document.querySelector('.modal__genre-average');

const botaoClaridade = document.querySelector('.btn-theme');
const body = document.querySelector('body');


let luz = true;
botaoClaridade.addEventListener('click', function () {
    if(luz){
        botaoClaridade.src = "./assets/dark-mode.svg";
        body.style.setProperty('--light', '#242424');
        body.style.setProperty('--background-dark', '#fff');
        body.style.setProperty('--color-dark', '#fff');
        body.style.setProperty('--lightDark', '#454545');
        paginaAnterior.src = './assets/seta-esquerda-branca.svg';
        proximaPagina.src = './assets/seta-direita-branca.svg';
        luz=false;
    }else{
        botaoClaridade.src ="./assets/light-mode.svg";
        body.style.setProperty('--light', '#fff');
        body.style.setProperty('--background-dark', '#242424');
        body.style.setProperty('--color-dark', '#000');
        body.style.setProperty('--lightDark', '#fff');
        paginaAnterior.src = './assets/seta-esquerda-preta.svg';
        proximaPagina.src = './assets/seta-direita-preta.svg';
        luz=true;
    }
})
input.addEventListener('keydown', function(event){
    if(event.key !== 'Enter'){
        return;
    }if(event.target){
        if(input.value === ''){
           listaFilmes( `https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR`);
        }else if(input.value.length > 2){
            listaFilmes(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`);
        }
    }
})
listaFilmes(`https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR`)
function listaFilmes(link){
    console.log(link)
    fetch(`${link}`).then(function(resposta){
        const promiseResponse = resposta.json();

        const arrayFilmes =[];
        promiseResponse.then(function(movies){
            const zero = (movies.results).slice(0,5);
            const um = (movies.results).slice(5,10);
            const dois = (movies.results).slice(10,15);
            const tres = (movies.results).slice(15,20);
            
            arrayFilmes.push(zero,um,dois,tres);
        
            let cont = 0;
            proximaPagina.addEventListener('click', function(numero){
                cont++;
                if(cont>3){
                    cont = 0;
                }
                
            filmes(cont);
            });
            paginaAnterior.addEventListener('click', function(){
                cont--;
                if(cont<0){
                    cont = 3;
                };
                
                filmes(cont);
            });
            filmes(cont);
        
            function filmes(index){
                
                let indexx = arrayFilmes[index];
                div_movies.innerHTML = '';
                indexx.forEach((element) => {
                    
                    const movieNovo = document.createElement('div');
                    movieNovo.classList.add('movie');
                    movieNovo.style.backgroundImage=`url( ${element.poster_path})`;

                    const movie_info = document.createElement('div');
                    movie_info.classList.add('movie__info');
                    
                    const movie_titleNovo = document.createElement('span');
                    movie_titleNovo.classList.add('movie__title');
                    const string = (element.title).split("",12);
                    movie_titleNovo.textContent = string.join('') + '...';
                
                    const movie_ratingNovo = document.createElement('span');
                    movie_ratingNovo.classList.add('movie__rating');
                    movie_ratingNovo.textContent = element.vote_average;

                    const imgMovie = document.createElement('img');
                    imgMovie.src = "./assets/estrela.svg";
                    imgMovie.alt ='Estrela';
                    
                    movie_ratingNovo.append(imgMovie);
                    movie_info.append(movie_titleNovo, movie_ratingNovo);
                    movieNovo.append(movie_info);
                    div_movies.append(movieNovo);
                    movie.classList.add('hidden'); 

        
                    movieNovo.addEventListener('click', function(event){
                        modal.classList.remove('hidden');

                        fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${element.id}?language=pt-BR`).then(function (resposta) {
                            const promiseResponse = resposta.json();
                            promiseResponse.then(function (modal) {
                            modal_title.textContent = modal.title;
                            modal_img.src = modal.backdrop_path;
                            modal_description.textContent = modal.overview;
                            modal_genres.innerHTML = '';
                            (modal.genres).forEach(x=>{
                                const genero = document.createElement('span');
                                genero.classList.add('modal__genre');
                                genero.textContent = x.name;
                                modal_genres.append(genero);
                            })
                            modal_average.textContent = modal.vote_average; 
                            })
                        })
                    })
                    closeModal.addEventListener('click', function(){
                        modal.classList.add('hidden');     
                    })
                    modal.addEventListener('click', function () {
                        modal.classList.add('hidden');   
                    });    
                })                
            }   
        })
    });
}
fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then(function(resposta){
    const promiseResponse = resposta.json();
    promiseResponse.then(function(filme){
        highlightVideo.style.backgroundImage = `url(${filme.backdrop_path})`;
        highlightTitle.textContent = filme.title;
        highlightRating.textContent = filme.vote_average;

        let string ='';
        filme.genres.forEach(x=>{
           string = ` ${string}, ${x.name}`;
        })
        highlightGenres.textContent = string.trimStart().slice(1).toUpperCase();

        const b = new Date(filme.release_date);
        const month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][b.getMonth()];
        highlightLaunch.textContent = `${b.getDate()} DE ${month.toUpperCase()} DE ${b.getFullYear()}`;
        highlightDescription.textContent = filme.overview;
    })
})
fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR').then(function(resposta){
    const promiseResponse = resposta.json();
    promiseResponse.then(function(video){
        const link = (video.results[0].key);
        highlightVideoLink.href ="https://www.youtube.com/watch?v=" + link;
    })
})

