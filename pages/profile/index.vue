<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <button 
              class="btn btn-sm btn-outline-secondary action-btn" 
              :class="{ active: profile.following }"
				      @click="onFollowing(profile)"
            >
              <i class="ion-plus-round"></i>
              &nbsp;
              Follow Eric Simons
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link class="nav-link" :class="{ active: tab === 'my' }" :to="{
                  name: 'profile',
                  query: {
                    tab: 'my'
                  }
                }" exact>My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link" :class="{ active: tab === 'favorite' }" :to="{
                  name: 'profile',
                  query: {
                    tab: 'favorite'
                  }
                }" exact>Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link :to="{
                name: 'profile',
                params: {
                  username: article.author.username
                }
              }"><img :src="article.author.image" /></nuxt-link>
              <div class="info">
                <nuxt-link class="author" :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }">{{ article.author.username }}</nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button 
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="article.favorited ? 'active':''" 
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link :to="{
              name: 'article',
              params: {
                slug: article.slug
              }
            }" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list" v-if="article.tagList.length > 0">
                <li class="tag-default tag-pill tag-outline" v-for="tag in article.tagList" :key="tag">{{ tag }}</li>
              </ul>
            </nuxt-link>
          </div>

          <nav>
            <ul class="pagination">
              <li class="page-item" :class="{
                active: item === page
              }" v-for="item in totalPage" :key="item">
                <nuxt-link class="page-link" :to="{
                  name: 'profile',
                  query: {
                    page: item,
                    tab: $route.query.tab
                  }
                }">{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { getProfiles } from '@/api/profile'
import { getArticles, addFavorite, deleteFavorite, addFollow, deleteFollow } from '@/api/article'
import { mapState } from 'vuex'
export default {
  middleware: 'authenticated',
  name: "UserProfile",
  watchQuery: ['tab', 'page'],
  async asyncData(context) {
    const { username } = context.params
    const { page = 1, tab = 'my' } = context.query

    const limit = 10
    const offset = (page - 1) * limit
    const articleParams = tab === 'my' ? { author: username } : { favorited: username }
    articleParams.limit = limit
    articleParams.offset = offset

    const [profilesRes, ArticleRes] = await Promise.all([
      getProfiles(username),
      getArticles(articleParams)
    ])
    const { profile } = profilesRes.data
    const { articles, articlesCount } = ArticleRes.data
    articles.forEach(item=>item.favoriteDisabled=false)
    return {
      profile,
      articles,
      articlesCount,
      limit,
      tab,
      page
    }
  },
  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    async onFavorite(article){
      article.favoriteDisabled = true
      if (article.favorited) {
        await deleteFavorite(article.slug)
        article.favorited = false,
        article.favoritesCount -= 1
      } else {
        await addFavorite(article.slug)
        article.favorited = true,
        article.favoritesCount += 1
      } 
      article.favoriteDisabled = false
    },
    async onFollowing (profile) {
      console.log(profile);
			if (profile.following) {
				await deleteFollow(profile.username)
				profile.following = false
			} else {
				await addFollow(profile.username)
				profile.following = true
			}
		}
  }
}
</script>

<style scoped>
</style>
