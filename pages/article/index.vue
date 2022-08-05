<template>
  <div class="article-page">


    <div class="banner">
      <div class="container">

        <h1>{{ article.title }}</h1>
        <article-mrta :article="article"></article-mrta>
      </div>
    </div>

    <div class="container page">

      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
      </div>

      <hr />

      <div class="article-actions">
        <article-mrta :article="article"></article-mrta>
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <article-comment :article="article"></article-comment>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import articleMrta from './components/articleMrta.vue'
import articleComment from './components/articleComment.vue'
import { getArticle } from '@/api/article'
import MarkdownIt from 'markdown-it'
export default {
  middleware: 'authenticated',
  name: 'articleIndex',
  async asyncData({ params }) {
    console.log(params);
    const { data } = await getArticle(params.slug)
    const { article } = data
    const md = new MarkdownIt()
    article.body = md.render(article.body)
    return {
      article
    }
  },
  components: {
    articleMrta,
    articleComment
  },
  head() {
    return {
      title: `${this.article.title} -  RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  }
}
</script>

<style>
</style>
