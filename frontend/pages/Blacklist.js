
import { useState, useEffect } from 'react'
import Navbar from '../components/navbar'
import styles from '../styles/Home.module.css'
import withAuth from '../components/withAuth'
import config from '../config/config'
import axios from 'axios';
import Layout from '../components/layout'
const URL = `http://localhost/api/Blacklists`


const admin = ({ token }) => {
    const [blacklists,setBlacklists] = useState({});
    const [blacklist, setBlacklist] = useState({});
    const [name, setName] = useState('');
    const [products, setProducts] = useState('');
    const [details, setDetails] = useState('');
    const [cost, setCost] = useState(0);
    useEffect(() => {
      getBlacklists();
      profileUser();
    }, []);
    const profileUser = async () => {
        try {
          
          const users = await axios.get(`${config.URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
         
          setUser(users.data);
        } catch (e) {
          console.log(e);
        }
      };
    

const getBlacklists = async () => {
        let blacklist = await axios.get(URL)
        setBlacklists(blacklist.data)
    
}
const getBlacklist = async (id) => {
        let blacklist = await axios.get(`${URL}/${id}`);
        setBlacklist(blacklist.data)
}
      const addBlacklist = async (name, products, details ,cost) => {
        let blacklist = await axios.post(URL, { name, products, details ,cost})
        console.log(blacklist.data);
        getBlacklists();
       
      }
      const updateBlacklist = async (id) => {
        let blacklist = await axios.put(`${URL}/${id}`, { name, products, details ,cost })
        setBlacklists(blacklist.data)
        getBlacklists();
      }
    
      const deleteBlacklist = async (id) => {
        let blacklist = await axios.delete(`${URL}/${id}`, { name, products, details ,cost })
        getBlacklists();
      }
    
      const printBlacklists = () => {
        if (blacklists.list && blacklists.list.length) {
            return blacklists.list.map((item, index) => {
              return (
                <div className={styles.listItem} key={index}>
                   
                  <b> {index+1}.) Name:</b>{item.name}  <br />
                  <b>Product:</b> {item.products} <br />
                  <b>Details:</b> {item.details} <br />
                  <b>Cost:</b> {item.cost} <br />
                  <div >
                   <button onClick={() => getBlacklist(item.id)} >
                    Get
                    </button>

                    <button onClick={() => updateBlacklist(item.id)} >
                      Update
                    </button>
                    <button onClick={() => deleteBlacklist(item.id)}>
                      Delete
                    </button>
                  </div>
                  <br></br>
                </div>
              );
            });
          } else {
            return <p>Loading...</p>;
          }
        };


    return (
      <Layout>
            <div className={styles.container}>
                <Navbar />
            <h2>Add Blacklist</h2>
            Name:<input type="text" onChange={(e) => setName(e.target.value)}/>
            Product:<input type="text" onChange={(e) => setProducts(e.target.value)}/>
            Details:<input type="text" onChange={(e) => setDetails(e.target.value)}/>
            Cost:<input type="number" onChange={(e) => setCost(e.target.value)}/>
            <br></br>
             
            <button className={styles.buttoncolor} onClick={() => addBlacklist(name, products, details, cost)}>Add</button>
            
            <h3>Our Blacklist</h3>
            <div className={styles.list}>{printBlacklists()}</div>
            </div>
            </Layout>
        )
        
};
      
    
export default withAuth(admin)

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}


