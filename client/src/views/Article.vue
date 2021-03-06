
<template>
    <div class="page-wrapper">

        <div class="header">
            <h1>Article</h1>
        </div>

        <div class="content-wrap">


            <div class="col-1">
                <div class="tag" v-for="tag in tags" :key="tag.id" :class="{'active-tag': filterTags.has(tag)}" @click="clickTag(tag)">
                    {{tag.content}}
                </div>
            </div>


            <div class="col-2">

                <div v-if="filterTags.size > 0" class="filter-tags-wrap">
                    <div class="filter-tag" v-for="tag in filterTags" :key="tag.id">
                        {{tag.content}}
                    </div>
                </div>

                <div class="article-tags-wrap">
                    <div v-for="article in articles" :key="article.id" class="article">
                        <div class="img">

                        </div>
                        <div class="article-content">
                            <span class="date">
                                {{article.date}}
                            </span>

                            <span class="time">
                                {{article.time}}
                            </span>

                            <span class="tags">
                                <div v-for="tag in article.tags" :key="tag.id">
                                    {{tag.content}}
                                </div>
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        
    </div>
</template>


<script lang="ts">
    
    import axios, { AxiosResponse } from 'axios';
    import { defineComponent, Ref, ref } from 'vue';


    export default defineComponent({
        
        setup(){

            const basicUrl = "127.0.0.1:3000";

            let 
                articles  : Ref<Array<Record<string, unknown>>> = ref([]),
                filterTags: Ref<Set<Record<string, unknown>>>   = ref(new Set()),
                tags      : Ref<Array<Record<string, unknown>>> = ref([]);


            const 
                getTags = () => {
                    axios.get(`http://${basicUrl}/tag/get-all`).then((response: AxiosResponse) => {
                        tags.value = response.data.tags;
                    });
                },

                clickTag = (tag: {id: number, content: string}) => {
                    
                    if(!filterTags.value.has(tag)){
                        filterTags.value.add(tag);
                    } else {
                        filterTags.value.delete(tag);
                    }

                    getArticles();
                },

                removeFilterTag = (tag: {id: number, content: string}) => {
                    filterTags.value.delete(tag);
                    getArticles();
                },

                getArticles = () => {
                    let tagIds: Array<number> = [];

                    filterTags.value.forEach((tag: Record<string, any>) => {
                        tagIds.push(tag.id);
                    });

                    axios.get(`http://${basicUrl}/article/get-all?tagIds=${tagIds.join(',')}`).then((response: AxiosResponse) => {
                        articles.value = response.data;
                    })
                };

            getTags();
            getArticles();


            return {
                tags,
                filterTags,
                articles,

                clickTag,
                removeFilterTag,
            }
        }
    })
</script>



<style lang="scss">
    
    .page-wrapper{
        margin-top: 100px;
        padding: 0px 50px;
    }

    .header{
        font-size: 40px;
        font-weight: bold;
    }

    .content-wrap{
        display: grid;
        grid-template-columns: 350px auto;
        column-gap: 50px;
        margin-top: 30px;

        .col-1{
            display: grid;
            grid-auto-rows: max-content;
            row-gap: 20px;
            max-width: 100%;

            .tag{
                padding: 13px 15px;
                background: rgb(231, 228, 228);
                border-radius: 10px;
                box-sizing: border-box;
                cursor: pointer;

                &:hover{
                    transition: .4s;
                    background: rgb(196, 190, 190);
                }
            }

            .active-tag{
                color: rgb(33, 177, 202);
                font-weight: bold;
                border: 2px solid rgb(33, 177, 202);
            }
        }

        .col-2{

            .filter-tags-wrap{
                display: grid;
                grid-auto-flow: column;
                grid-auto-columns: max-content;
                column-gap: 15px;
                margin-bottom: 40px;

                .filter-tag{
                    font-size: 18px;
                    border: 1px solid rgb(41, 215, 228);
                    border-radius: 8px;
                    text-align: center;
                    box-sizing: border-box;
                    padding: 10px;
                }
            }

            .article-tags-wrap{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
                gap: 30px;

                .article {
                    display: grid;
                    grid-auto-columns: 1fr 1fr;
                    padding: 13px 15px;
                    background: rgb(231, 228, 228);
                    border-radius: 10px;

                    .article-content{
                        display: grid;
                        row-gap: 15px;
                    }

                    .tags{
                        display: grid;
                        grid-auto-flow: column;
                        column-gap: 10px;
                        grid-auto-columns: max-content;

                        >div{
                            box-sizing: border-box;
                            padding: 5px;
                            border: 1px solid rgb(41, 215, 228);
                        }
                    }
                }
            }
        }
    } 

</style>