<!--  -->
<template>
	<div class="article-meta">
		<nuxt-link :to="{
			name: 'profile',
			params: {
				username: article.author.username
			}
		}">
			<img :src="article.author.image">
		</nuxt-link>
		<div class="info">
			<nuxt-link :to="{
				name: 'profile',
				params: {
					username: article.author.username
				}
			}">{{ article.author.username }}
			</nuxt-link>
			<span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
		</div>
		<template v-if="isAuthor">
			<nuxt-link 
				class="btn btn-sm btn-outline-secondary"
				:to="{
					name: 'editor',
					params: {
						slug: article.slug
					}
				}"
			>
				<i class="ion-edit"></i>
				&nbsp;
				Edit Article
			</nuxt-link>
			&nbsp;&nbsp;
			<button 
				:disabled="isDisabled"
				class="btn btn-sm btn-outline-danger" 
				@click="delArticle(article.slug)">
				<i class="ion-trash-a"></i>
				&nbsp;
				Delete Article
			</button>
		</template>
		<template v-else>
			<button 
				class="btn btn-sm btn-outline-secondary"
				:class="{active: article.author.following}"
				@click="onFollowing(article.author)"
			>
				<i class="ion-plus-round"></i>
				&nbsp;
				Follow {{ article.author.username }}
			</button>
			&nbsp;&nbsp;
			<button 
				class="btn btn-sm btn-outline-primary"
				:class="{active: article.favorited}"
				@click="onFavorite(article)"
			>
				<i class="ion-heart"></i>
				&nbsp;
				Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
			</button>
		</template>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import {
	addFavorite,
	deleteFavorite, 
	deleteArticle,
	addFollow,
	deleteFollow
} from '@/api/article'
export default {
	props: {
		article: {
			type: Object,
			require: true
		}
	},
	data() {
		return {
			isDisabled: false
		}
	},
	created() {

	},
	mounted() {
		this.article.favoriteDisabled = false
		this.article.author.followingDisabled = false
	},
	computed: {
		...mapState(['user']),
		isAuthor () {
			return this.user.username === this.article.author.username
		}
	},
	methods: {
		// 删除当前文章
		async delArticle (slug) {
			this.isDisabled = true
			await deleteArticle(slug)
      this.$router.push('/')
			this.isDisabled = false
		},
		// 点赞
		async onFavorite(article) {
			article.favoriteDisabled = true
			if (!this.user) this.$router.push('/')
			if (article.favorited) {
				await deleteFavorite(article.slug)
				article.favoritesCount -= 1
				article.favorited = false
			} else {
				await addFavorite(article.slug)
				article.favoritesCount += 1
				article.favorited = true
			}
			article.favoriteDisabled = false
		},

		async onFollowing (author) {
			author.followingDisabled = true
			if (!this.user) this.$router.push('/')
			if (author.following) {
				await deleteFollow(author.username)
				author.following = false
			} else {
				await addFollow(author.username)
				author.following = true
			}
			author.followingDisabled = false
		}
	}
}
</script>
<style scoped>
</style>