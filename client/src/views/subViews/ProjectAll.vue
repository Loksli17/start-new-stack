
<template>

    <div class="mt-6 px-10 ">
        <button class="p-4 w-max bg-blue-500  text-white text-lg rounded" @click="newModalToggle = true">Create project</button>
    </div>

    <div class="mt-6 px-10 grid gap-5 grid-cols-project-wrap auto-rows-max">
        <ProjectView v-for="project in projects" :key="project.id" :data="project"></ProjectView>
    </div>

        <div @click.self="newModalToggle = false" class="grid justify-center items-center fixed z-50 w-full h-full z-1 bg-gray-800 bg-opacity-80 top-0 left-0" :class="{'hidden': !newModalToggle}">
            
        <form class=" bg-white p-8 grid gap-10 opacity-100 rounded">
            <input class="cursor-pointer border-2 border-gray-600 p-3" type="text" name="name" v-model="name" placeholder="write project name here..">
            <input class=" p-4 bg-blue-500 text-white cursor-pointer rounded" type="submit" @click.prevent="sendProject" value="Create project">
        </form>
    </div>

</template>


<script lang="ts">

    import { computed, defineComponent, inject, nextTick, Ref, ref } from 'vue';

    import ProjectView            from '../../components/ProjectView.vue';
    import { io, Socket }     from 'socket.io-client';
    import { ToastPluginApi } from 'vue-toast-notification';

    import { useUserStore }  from '../../store/user';


    export default defineComponent({

        components: {
            ProjectView,
        },
        
        setup() {

            const
                basicUrl              = "http://127.0.0.1:3000",
                storeUser             = useUserStore(),
                Toast: ToastPluginApi = inject('Toast') as ToastPluginApi;

            const socket: Socket = io(basicUrl, {
                autoConnect    : true,
                withCredentials: true,
            });

            const 
                sendProject = () => {
                    socket.emit('createProject', {userId: storeUser.user.id, name: name.value});
                };

            socket.on('createProject', (data: any) => {
                projects.value.unshift(data);
                Toast.success(`project with ${name.value} has been created`); 
            });

            socket.emit('getProjects', {userId: storeUser.user.id});

            socket.on('getProjects', (data: any) => {
                projects.value = data.projects;
            });

            let 
                projects      : Ref<Array<Record<string, any>>> = ref([]),
                name          : Ref<string>                     = ref(""),
                newModalToggle: Ref<boolean>                    = ref(false);


            return {
                name,
                newModalToggle,

                sendProject,

                projects,
            }
        },
    })
</script>
