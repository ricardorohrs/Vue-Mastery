Vue.component('product', {
	props: {
		premium: {
			type: Boolean,
			required: true
		} 
	},
	template: `
	<div class="product">
			<div class="product-image">
				<img v-bind:src="image">
			</div>
			<div class="product-info">
				<h1>{{ title }}</h1>
				<p v-if="inStock">In Stock</p>
      			<p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
      			<p>Frete: {{ shipping }}</p>

				<ul>
					<li v-for="detail in details">{{ detail }}</li>
				</ul>

				<ul>
        			<li v-for="size in sizes">{{ size }}</li>
      			</ul>

				<div v-for="(variant, index) in variants" 
					:key="variant.variantId"
					class="color-box"
					:style="{ backgroundColor: variant.variantColor }" 
					@mouseover="updateProduct(index)">
				</div>

				<button v-on:click="addToCart"
						:disabled="!inStock"
						:class=" { disabledButton: !inStock }">Adicionar ao carrinho</button>
				<button v-on:click="removeToCart">Remover do carrinho</button>

			</div>
			
			<product-review @review-submitted="addReview"></product-review>

			<div class="teste">
				<h2>Avaliações</h2>
				<p v-if="!reviews.length">Ainda não há reviews</p>
				<ul>
					<li v-for="review in reviews">
						<p>{{ review.name }}</p>
						<p>Nota: {{ review.rating }}</p>
						<p>{{ review.review }}</p>
					</li>
				</ul>
			</div>

		</div> 
	`,
	data() {
		return {
			brand: 'Vue Mastery',
			product: 'Socks',
			selectedVariant: 0,
			details: ["80% algodão", "20% poliester", "Gênero neutro"],
			variants: [
				{ 
					variantId: 2234,
					variantColor: "green",
					variantImage: './vmSocks-green-onWhite.jpg',
					variantQuantity: 10
				},
				{
					variantId: 2235,
					variantColor: "blue",
					variantImage: './vmSocks-blue-onWhite.jpg',
					variantQuantity: 0
				}
			],
			sizes: ['P', 'PP', 'M', 'G', 'GG', 'GGG'],
			reviews: []
		}
		},
		methods: {
			addToCart: function() {
				this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
			},
			removeToCart() {
				this.$emit('remove-to-cart', this.variants[this.selectedVariant].variantId)
			},
			updateProduct (index) {
				this.selectedVariant = index
			},
			addReview(productReview) {
				this.reviews.push(productReview)
			}
		},
		computed: {
			title() {
				return this.brand + ' ' + this.product
			},
			image() {
				return this.variants[this.selectedVariant].variantImage
			},
			inStock() {
				return this.variants[this.selectedVariant].variantQuantity
			},
			shipping() {
				if (this.premium) {
					return "Grátis"
				}
				return 9.99
			}	
		}
	})

Vue.component('product-review', {
	template: `
	  <form class="review-form" @submit.prevent="onSubmit">

 	  <p v-if="errors.length">
 	 	<b>Por favor corrija os seguintes erro(s):</b>
 	 	<ul>
 	 		<li v-for="error in errors">{{ error }}</li>
 	 	</ul>
	  </p>
      
      <p>
        <label for="name">Nome:</label>
        <input id="name" v-model="name" placeholder="nome">
      </p>
      
      <p>
        <label for="review">Avaliação:</label>      
        <textarea id="review" v-model="review" ></textarea>
      </p>
      
      <p>
        <label for="rating">Nota:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
	`,
	data() {
		return {
			name: null,
			review: null,
			rating: null,
			errors: []
		}
	},
	methods: {
		onSubmit() {
			if (this.name && this.review && this.rating) {
				let productReview = {
				name: this.name,
				review: this.review,
				rating: this.rating
				}
				this.$emit('review-submitted', productReview)
				this.name = null
				this.review = null
				this.rating = null
			} else {
				if (!this.name) this.errors.push("Nome obrigatório!")
				if (!this.review) this.errors.push("Avaliação obrigatório!")
				if (!this.rating) this.errors.push("Nota obrigatório!")
			}
		}
	}
})

var app = new Vue({
	el: '#app',
	data: {
		premium: true,
		cart: []
	},
	methods: {
		updateCart(id) {
			this.cart.push(id)
		},
		removeToCart(id) {
			this.cart.pop(id)
		}
	}
});