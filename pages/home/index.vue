<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link 
                  class="nav-link" 
                  :class="tab === 'your_feed' ? 'active' : ''"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }" 
                  exact
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link" 
                  :class="tab === 'global_feed' ? 'active' : ''"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed'
                    }
                  }" 
                  exact
                >Global Feed</nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link 
                  class="nav-link" 
                  :class="tab === 'tag' ? 'active' : ''"
                  :to="{
                    name: 'home',
                    query: {
                      tag,
                      tab: 'tab'
                    }
                  }"
                  exact
                >#{{tag}}</nuxt-link>
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
              }">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link class="author" :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }"> {{ article.author.username }}
                </nuxt-link>
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
            <nuxt-link class="preview-link" :to="{
              name: 'article',
              params: {
                slug: article.slug
              }
            }">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list" v-if="article.tagList.length>0">
                <li 
                  class="tag-default tag-pill tag-outline"
                  v-for="tag in article.tagList"
                  :key="tag"
                >{{tag}}</li>
              </ul>
            </nuxt-link>
          </div>

          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li class="page-item" :class="{
                active: item === page
              }" v-for="item in totalPage" :key="item">
                <nuxt-link class="page-link" :to="{
                  name: 'home',
                  query: {
                    page: item,
                    tag: $route.query.tag,
                    tab: $route.query.tab
                  }
                }">{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
          <!-- 分页列表 -->
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <nuxt-link :to="{
                name: 'home',
                query: {
                  tag: item,
                  tab: 'tag'
                }
              }" class="tag-pill tag-default" v-for="item in tags" :key="item">{{ item }}</nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>

</template>

<script>
import { 
  getArticles, 
  getYourFeedArticles ,
  addFavorite,
  deleteFavorite
} from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'
export default {
  name: "HomeIndex",
  data() {
    return {}
  },
  watchQuery: ['page', 'tag', 'tab'],
  async asyncData({ query, store }) {
    // 每页的条数
    const limit = 20
    // 当前页码
    const page = Number.parseInt(query.page || 1)
    // 当前选中的 tag
    const tag = query.tag
    // 当前选中的tab
    const tab = query.tab || 'global_feed'
    const loadArticles = store.state.user && tab === 'your_feed'
      ? getYourFeedArticles
      : getArticles
    const [articlesRes, tagRes] = await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag
      }),
      getTags()
    ])
    const { articles, articlesCount} = articlesRes.data
    const { tags } = tagRes.data
    articles.forEach(item=>item.favoriteDisabled=false)
    return {
      limit,
      page,
      articles,
      articlesCount,
      tags,
      tag,
      tab
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    },
    ...mapState(['user'])
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
    }
  }
}
</script>

<style scoped>
</style>
