<template>
    <div class="bg-gray-100">

        <div class="container mx-auto py-8">
            <div class="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                <div class="col-span-4 sm:col-span-3">
                    <div class="bg-white shadow rounded-lg p-6">

                        <div class="flex flex-col items-center">
                            <!-- <img :src="`/uploads/profile/${profile.pPic}`"
                                class="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0" />

                            <input type="file" @change="handleFileChange" /> -->
                            <!-- <button @click="uploadFile">Upload</button> -->

                            <!-- Image -->
                            <img :src="`/uploads/profile/${profile.pPic}`"
                                class="pPic w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0 cursor-pointer"
                                @click="triggerFileInput" alt="Profile Picture" />
                            <img :src="`/uploads/profile/upload.webp`"
                                class="pPic2 w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0 cursor-pointer"
                                @click="triggerFileInput" alt="Profile Picture" />

                            <!-- Hidden File Input -->
                            <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" />

                            <h1 v-if="!saveEdit" class="text-xl font-bold">{{ profile.name }}</h1>
                            <Input v-else v-model="profile.name" placeholder="Name" clearable style="width: 200px" />
                            <p v-if="!saveEdit" class="text-gray-700">{{ profile.role }}</p>
                            <Input v-else v-model="profile.role" placeholder="Role" clearable style="width: 200px" />
                        </div>
                    </div>
                </div>

                <div class="col-span-4 sm:col-span-9">
                    <Tabs type="card">
                        <TabPane label="Profile">
                            <div class="bg-white shadow rounded-lg p-6">
                                <h2 class="text-xl font-bold mb-4">
                                    About Me
                                    <Button @click="saveProfile" v-if="saveEdit" :loading="loading" type="success">
                                        <Icon type="md-done-all" />Save
                                    </Button>
                                    <Button @click="saveEdit = !saveEdit" v-else type="primary">
                                        <Icon type="ios-create" />Edit Profile
                                    </Button>

                                    <Dropdown style="margin-left: 20px">
                                        <Button type="primary">
                                            Action
                                            <Icon type="ios-arrow-down"></Icon>
                                        </Button>
                                        <template #list>
                                            <DropdownMenu>
                                                <DropdownItem>
                                                    <router-link to="/">
                                                        <Button class="ml-2" long type="warning">
                                                            <Icon type="md-arrow-back" />Home
                                                        </Button>
                                                    </router-link>
                                                </DropdownItem>

                                                <DropdownItem>
                                                    <Button long @click="basicStore.changeModel(true)" type="info"
                                                        class="ml-2">
                                                        <Icon type="md-key" />Change Password
                                                    </Button>
                                                </DropdownItem>

                                                <DropdownItem>
                                                    <Button long @click="log_out()" type="error" class="ml-2">
                                                        <Icon type="md-power" />Logout
                                                    </Button>
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </template>
                                    </Dropdown>
                                </h2>
                                <p v-if="!saveEdit" class="text-gray-700">{{ profile.about }}</p>
                                <Input v-else v-model="profile.about" type="textarea"
                                    :autosize="{ minRows: 5, maxRows: 8 }" placeholder="Enter something..." />


                            </div>
                        </TabPane>
                        <TabPane label="Subscription">
                            <subscriptionsAbout></subscriptionsAbout>
                        </TabPane>
                    </Tabs>

                </div>

                <Modal okText="Back" width="1000" title="Change Password" v-model="basicStore.model"
                    :styles="{ top: '20px' }">
                    <changePassword></changePassword>
                </Modal>


            </div>
        </div>
    </div>
</template>

<script>
import { useBasicStore } from '../stores/basic'

import { UploadFilled } from '@element-plus/icons-vue'
import axios from "axios";
import axiosInstance from '@/utils/axios';
import subscriptionsAbout from '../components/subscriptionsAbout.vue';
import changePassword from '../components/changePassword.vue';

export default {
    name: "profile",
    components: { subscriptionsAbout, changePassword },
    setup() {
        const basicStore = useBasicStore()
        return { basicStore }
    },
    data() {
        return {
            selectedFile: null,

            saveEdit: false,
            cngPassModel: false,
            loading: false,
            profile: {
                name: "",
                pPic: "default.jpg",
                role: "",
                about: ""
            }

        };
    },
    methods: {
        triggerFileInput() {
            // Programmatically click the file input
            this.$refs.fileInput.click();
        },
        handleFileChange(event) {
            // this.selectedFile = event.target.files[0];
            // console.log(this.selectedFile)
            this.uploadFile(event.target.files[0]);
        },
        async uploadFile(selectedFile) {
            if (!selectedFile) {
                alert("Please select a file.");
                return;
            }

            const formData = new FormData();
            formData.append("file", selectedFile);

            var res = await uploadProfilePicture(formData);
            // console.log("Picture Updated Successfully !", res)

            if (res.status === 200) {
                this.$Notice.success({
                    title: 'Success',
                    desc: 'Profile Picture Updated Successfully!',
                });
                this.loadInitials();
            }
            else {
                this.$Notice.error({
                    title: 'Error',
                    desc: 'Uneble to upload.',
                });
            }


        },

        async handleExceed(file) {
            var x = await uploadProfilePicture(file);
            console.log("Picture Updated Successfully !", x)
        },

        test() {
            //   this.counterStore.increment()
            console.log('New Count:', this.basicStore.test)
        },
        // Load subscriptions
        async loadProfileInfo() {
            const res = await uploadProfileInformation()
            if (res.status === 200) {
                    this.profile = res.data;
                }
        },

        // Add subscription
        async saveProfile() {
            this.loading = true;
            // const axiosInstance = this.createAxiosInstance();
            try {
                await axiosInstance.post("/api/profile", this.profile);
                this.loadProfileInfo();
                this.loading = false;
                this.saveEdit = false;
                this.$Notice.success({
                    title: 'Success',
                    desc: 'Profile Updated Successfully!',
                });
            } catch (error) {
                console.error("Error adding subscription:", error);
                this.loading = false;
                this.saveEdit = false;
            } finally {
                this.loading = false;
                this.saveEdit = false;
            }
        },
        loadInitials() {
            this.loadProfileInfo();
        },
    },

    mounted() {
        this.loadInitials();
    },
};
</script>

<style scoped>
/* .pPic
{
    border: solid black 2px;
}
.pPic:hover
{
    opacity: 0.7;
    transition: opacity 0.3s ease-in-out;
    background-image: url(../public/uploads/profile/default.jpg);
} */

.pPic {
    border: 2px solid #000;
    /* Solid black border */
    border-radius: 50%;
    /* Round image */
    transition: all 0.3s ease-in-out;
    /* Smooth transition for hover effects */
    display: block;
    /* Ensures consistent layout */
    width: 120px;
    /* Fixed size for profile image */
    height: 120px;
    object-fit: cover;
    /* Ensures the image fits perfectly */
    cursor: pointer;
    /* Indicates clickable behavior */
    position: relative;
    /* For overlay positioning */
}

.pPic:hover {
    opacity: 0.8;
    /* Slight transparency on hover */
    transform: scale(1.05);
    /* Slight zoom-in effect */
    transition: all 0.3s ease-in-out;
    /* Smooth zoom and opacity transition */
}

.pPic:hover::after {
    content: 'Change Picture';
    /* Hint text on hover */
    position: absolute;
    inset: 0;
    /* Covers entire element */
    background-color: rgba(0, 0, 0, 0.5);
    /* Semi-transparent overlay */
    color: #fff;
    /* White text for better contrast */
    font-size: 0.875rem;
    /* Slightly smaller than default font size */
    font-weight: bold;
    /* Makes text prominent */
    display: flex;
    /* Center text */
    align-items: center;
    /* Vertically centered */
    justify-content: center;
    /* Horizontally centered */
    border-radius: 50%;
    /* Match rounded shape of the image */
    opacity: 0;
    /* Hidden by default */
    transition: opacity 0.3s ease-in-out;
    /* Smooth fade-in effect */
}

.pPic:hover::after {
    opacity: 1;
    /* Visible on hover */
}

.pPic2 {
    margin-top: -134px;
    border: 2px solid #000;
    /* Solid black border */
    border-radius: 50%;
    /* Round image */
    transition: all 0.3s ease-in-out;
    /* Smooth transition for hover effects */
    display: block;
    /* Ensures consistent layout */
    width: 120px;
    /* Fixed size for profile image */
    height: 120px;
    object-fit: cover;
    /* Ensures the image fits perfectly */
    cursor: pointer;
    /* Indicates clickable behavior */
    position: relative;
    /* For overlay positioning */
    opacity: 0;
}

.pPic2:hover {
    opacity: 0.5;
}
</style>