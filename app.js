/* open menu bar on responsive width */
const menuToggle = document.querySelector('.menuToggle')
const menu = document.querySelector('nav')
menuToggle.onclick = function(){
	this.classList.toggle('active')
	menu.classList.toggle('show')
}
menuToggle.classList.remove('active')


/* navigation change in mousescroll */
const sections = document.querySelectorAll('section');
const navli = document.querySelectorAll('nav ul li');
window.addEventListener("scroll", ()=> {
	let len = sections.length
	while(--len && window.scrollY + 97 < sections[len].offsetTop){}
		navli.forEach(item => item.classList.remove('active'))
		navli[len].classList.add('active')
})


/* close toggle navigation on selection */
navli.forEach(options => {
	options.onclick = function(){
		menu.classList.remove('show')
		menuToggle.classList.remove('active')
	}
})


/* changeable homepage text */
var typingText = new Typed('#changing-text', {
	strings : ["Pizza?","Burger?","Sushi?","Rice?","Momos?","Cookies?"],
	typeSpeed: 100,
	backSpeed: 70,
	backDelay: 1000,
	loop: true,
})


/* fetch recipes in card through API */
const searchBtn = document.getElementById('searchBtn')
const recipeContainer = document.querySelector('.recipe-container')
const loaderContainer = document.querySelector('.loader')
const errorImage = document.querySelector('.errorResult')
const popupContents = document.querySelector('.popup-contents')
const closePopupBtn = document.querySelector('.closeBtn')



var fetchFoodCards = async (data) => {
	loaderContainer.innerHTML = "<img src='assets/results-loading.gif' alt='loadingGif'><h2>Fetching data...</h2>"

	try {
		const dataLink = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${data}`)
		const response = await dataLink.json()
		loaderContainer.innerHTML = ""
		errorImage.innerHTML = ""
		response.meals.forEach(items => {
			const itemCard = document.createElement('div')
			itemCard.classList.add('item-card')
			itemCard.innerHTML = `<div class="card-img">
	              					<ion-icon name="heart-outline"></ion-icon>
	              					<img src="${items.strMealThumb}" alt="foodImage">
	            				  </div>
	            				  <div class="card-body">
	                				<h3 class="card-title">${items.strMeal}</h3>
	                				<p class="card-text">${items.strArea}</p>
	            				  </div>`

	       	const viewPopupBtn = document.createElement('button')
	        viewPopupBtn.classList.add('view-recipe-btn')
	        viewPopupBtn.textContent = "view recipe"
	        itemCard.appendChild(viewPopupBtn) 

	        recipeContainer.appendChild(itemCard)

	        //showing the popup on view recipe button click
	        viewPopupBtn.addEventListener('click', () => {
	        	openRecipeDetailsBox(items)
	        	// document.querySelectorAll('section').forEach(sections => sections.classList.add('blurBg'))
	        })

		})
	} 
	catch (error) {
		errorImage.innerHTML = "<img src='assets/no-result-found.gif' alt='errorGif'>"
		loaderContainer.innerHTML = ""
	}


}

/* fetch list ingredients */
const fetchIngredients = (items) => {
	let ingredientsList = ""
	for (var i = 1; i <= 20; i++) {
		const ingredient = items[`strIngredient${i}`]
		if (ingredient) {
			const measure = items[`strMeasure${i}`]
			ingredientsList += `<li>${measure} ${ingredient}</li>`
		}
		else{
			break
		}
	}
	return ingredientsList
}

/* popup box inner content details dynamic fetching on view-recipe button click */
const openRecipeDetailsBox = (items) => {
	popupContents.innerHTML = `<h1 class="title-name-text">${items.strMeal}</h1>
						<div class="recipe-details">
								<div class="body-contents">
									<div class="img-thumbnail">
										<img src="${items.strMealThumb}" alt="imageThumbnail">
									</div>
								</div>
								<div class="body-contents">
									<div class="ingredients">
										<h2>Ingredients</h2>
										<ul>${fetchIngredients(items)}</ul>
									</div>
								</div>
								<div class="body-contents">
									<div class="directions">
										<h2>Instructions</h2>
										<p>${items.strInstructions}</p>
									</div>
								</div>
							</div>`

	popupContents.parentElement.classList.add('open')
}



// callback function to fetch recipes related to input value searched
searchBtn.addEventListener('click', () => {
	var data = document.getElementById('search-food').value.trim()
	if (!data) {
		if (confirm("Value is empty...do you want random recipes?")) {
			recipeContainer.innerHTML = ""
			fetchFoodCards(data)
		}
	}
	else{
			recipeContainer.innerHTML = ""
			fetchFoodCards(data)
	} 
})


//popup close on close button click
closePopupBtn.addEventListener('click', () => {
	popupContents.parentElement.classList.remove('open')
	// document.querySelectorAll('section').forEach(sections => sections.classList.remove('blurBg'))
})
