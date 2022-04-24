import Head from 'next/head'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import withAuth from '../components/withAuth'
import config from '../config/config'

const Profile1 = ({ token }) => {

    const [user, setUser] = useState({})

    useEffect(() => {
        Contact()
    }, [])

    const Contact = async () => {
        try {
            // console.log('token: ', token)
            const users = await axios.get(`${config.URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            // console.log('user: ', users.data)
            setUser(users.data)
        }
        catch (e) {
            console.log(e)
        }

    }

 
    return (   
        <Layout>
            <Head>
                <title>Contact</title>
            </Head>
            
            <div className={styles.container}>
            <Navbar />
            <h1 class="ml-3 pt-5 py-4 justify-center text-indigo-800 text-3xl drop-shadow-lg text-lg font-medium leading-6 text-gray-900 ">Contact</h1>
            <br></br>
            <a href='https://www.facebook.com/Chalisa.Sinban'>
            <img src="https://scontent.furt2-1.fna.fbcdn.net/v/t1.6435-9/131117286_3274532816007714_3236096361346744454_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=zhiMN-S38RoAX8YQ4zu&_nc_ht=scontent.furt2-1.fna&oh=00_AT-w8lbQ14vpPVcVyWtQl0xr9U1vsrN7S2ovlkTy-drPjg&oe=6288BC77" width={300} height={200} />
            </a> 
            <br></br>
            <h3 class="text-xl font-medium text-gray-900 dark:text-gray-800">Chalisa Sinban 6135512020</h3>
            <br></br>
            </div>
            
            
        </Layout>
   
        
    )
}

export default withAuth(Profile1)

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
