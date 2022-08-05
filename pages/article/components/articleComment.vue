<!--  -->
<template>
	<div>
		<form class="card comment-form">
			<div class="card-block">
				<textarea class="form-control" placeholder="Write a comment..." rows="3" v-model="body"></textarea>
			</div>
			<div class="card-footer">
				<button class="btn btn-sm btn-primary" @click.prevent="postComment">
					Post Comment
				</button>
			</div>
		</form>

		<div class="card" v-for="comment in comments">
			<div class="card-block">
				<p class="card-text">{{ comment.body }}</p>
			</div>
			<div class="card-footer">
				<Nuxt-link 
					class="comment-author"
					:to="{
						name: 'profile',
						params: {
							username: comment.author.username
						}
					}"
				>
					<img :src="comment.author.imgage" class="comment-author-img" />
				</Nuxt-link>
				&nbsp;
				<Nuxt-link 
					class="comment-author"
					:to="{
						name: 'profile',
						params: {
							username: comment.author.username
						}
					}"
				>
					{{ comment.author.username }}
				</Nuxt-link >
				<span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { getComments, addComment } from '@/api/article'
export default {
	props: {
		article: {
			type: Object,
			require: true
		}
	},
	data() {
		return {
			comments: [],
			body: ""
		}
	},
	computed: {
		...mapState(['user'])
	},
	async mounted () {
		const { data } = await getComments(this.article.slug)
		this.comments = data.comments
	},
	methods: {
		async postComment () {
			if (!this.body) {
				alert('请输入内容')
			} else {
				const { data } = await addComment(this.article.slug, this.body)
				this.comments.unshift(data.comment)
				this.body=''
				console.log(data)
			}
		},
	},
}
</script>
<style scoped>
</style>