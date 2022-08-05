<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input type="text" v-model="article.title" class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                <input type="text" v-model="article.description" class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control" v-model="article.body" rows="8" placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click="publishArticle">
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createArticle, updateArticle, getArticle } from '@/api/article'
export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: 'authenticated',
  name: "EditorIndex",
  data () {
    return {
      article: {
        title: '',
        description: '',
        body: '',
        tagList: []
      },
      slug: ''
    }
  },
  async mounted () {
    const slug = this.$route.params.slug
    if (slug) {
      this.slug = slug
      const { data } = await getArticle(slug)
      this.article = data.article
    }
  },
  methods: {
    async publishArticle () {
      if (this.slug) {
        const { data } = await updateArticle(this.slug,{
          article: this.article
        })
        this.$router.push(`/article/${data.article.slug}`)
      } else {
        const { data } = await createArticle({
          article: this.article
        })
        this.$router.push(`/article/${data.article.slug}`)
      }
    }
  }
}
</script>

<style scoped>

</style>
