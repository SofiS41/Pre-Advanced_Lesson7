async function getPosts(link){
	try {
		const post = await fetch(link);
		const response = await post.json();
		return response;
	} catch (err) {
		console.log('Error in getPosts()', err);
	}
}
function createPost(id, title, poster, type, year){
	let post = document.createElement('div');
	post.classList.add('movies-list__item', 'movie');
	post.innerHTML = `<img class="movie__image" src="${poster}" alt="${title}">
		<div class="movie__content">
			<h3 class="movie__title">${title}</h3>
			<div class="movie__bottom">
				<div class="movie__bottom_info">
					<div class="movie__year">${year}</div>
					<div class="movie__categories">${type}</div>
				</div>
				<div class="movie__more-details" data-id="${id}" onclick="openDetails('${id}')">Переглянути <svg width="12" height="14" viewBox="0 0 12 14"><use xlink:href="#arrow"/></svg></div>
			</div>
		</div>
	</div>`;
	return post;
}
async function getSingle(singleId){
	try {
		const singlePost = await fetch(`http://www.omdbapi.com/?i=${singleId}&apikey=886b6f52`);
		const response = await singlePost.json();
		return response;
	} catch (err) {
		console.log('Error in getSingle()', err);
	}
}


const searchForm = document.forms.searchForm,
	firstSection = document.querySelector('.first-screen'),
	movieList = document.querySelector('.movies-list');
const singleBlock = document.getElementById('single');
let closePopup = singleBlock.querySelector('.close-popup');

if(searchForm){
	searchForm.addEventListener('submit', (e)=>{
			e.preventDefault();
			movieList.innerHTML = '';
			let string = 'http://www.omdbapi.com/?s='+searchForm.text.value+'&apikey=886b6f52';
			getPosts(string).then(result => {
					result.Search.forEach(el => {
						let post = createPost(el.imdbID, el.Title, el.Poster, el.Type, el.Year);
						movieList.appendChild(post);
					});
			}).catch(err =>{
				console.log('Error in search', err);
			});
			firstSection.classList.remove('hello-screen');
	})
}

function openDetails(single_id){
	getSingle(single_id).then(result =>{
		let seasons = result.Type === 'series' ? `<div class="single__info"><span class="single__info_name">Кідькість сезонів:</span><span class="single__info_text">${result.totalSeasons}</span></div>` : '';

		singleBlock.querySelector('.single__left').innerHTML = `
			<img src="${result.Poster}" alt="Poster for ${result.Title}">
			<span class="rating">${result.imdbRating}</span>
			<span class="type">${result.Type}</span>
		`;

		singleBlock.querySelector('.movie-details').innerHTML = `
			<p class="single__title">${result.Title}</p>
			<div class="single__info"><span class="single__info_name">Реліз:</span><span class="single__info_text">${result.Released}</span></div>
			<div class="single__info"><span class="single__info_name">Жанри:</span><span class="single__info_text">${result.Genre}</span></div>
			<div class="single__info"><span class="single__info_name">Країна:</span><span class="single__info_text">${result.Country}</span></div>
			<div class="single__info"><span class="single__info_name">Тривалість:</span><span class="single__info_text">${result.Runtime}</span></div>
			${seasons}
			<div class="single__info"><span class="single__info_name">Опис:</span><span class="single__info_text">${result.Plot}</span></div>
		`;
	}).catch(err =>{
		console.log('Errors in createSingle', err);
	})
	singleBlock.classList.remove('hide');
}

closePopup.addEventListener('click', () => singleBlock.classList.add('hide'));
singleBlock.addEventListener('click', e => {
	if(!e.target.closest('.single__content')) singleBlock.classList.add('hide');
})