import React from "react";
import "./signUpPage.scss";
import contractCall from "../ContractCall/ContractCall";
import { ethers } from "ethers";
import { Link, useOutletContext } from "react-router-dom";
import SignUpForm from "../Auth/SignUpForm/SignUpForm";
import graph from "../Images/graph.png"
const { ethereum } = window;


function SignUpPage() {

    const [state, setState] = useOutletContext();

    const MMConnected = state?.MMConnected;
    const ethAddr = state?.ethAddr;

    async function connectWalletHandler() {
        if (ethereum) {
            await ethereum.request({method: 'eth_requestAccounts'})
            const prov = new ethers.providers.Web3Provider(ethereum);
            setTimeout( async () => {
              setState(prevState => ({
                ...prevState,
                provider: prov
              }));
              const signr = await prov.getSigner();
              setState(prevState => ({
                ...prevState,
                signer: signr
              }));
              const addr = await signr.getAddress();
              setState(prevState => ({
                ...prevState,
                ethAddr: addr
              }));
              setState(prevState => ({
                ...prevState,
                MMConnected: true
              }));
              makeDispAddr(addr);
            }, 1300)
        }
    }

    function makeDispAddr(numAddr) {
        const strAddr = numAddr.toString();
        const first = strAddr.slice(0,4);
        const last = strAddr.slice(-4);
        const dispAddr = `${first}...${last}`;
        setState(prevState => ({
          ...prevState,
          displayAddr: dispAddr
        }));
    }

    // function readable(num) {
    //     return ethers.utils.formatUnits(parseInt(num).toString(), 18);
    // }
    // async function contractCallHandler() {
    //     let contractInstance = await contractCall();
    //     if (await contractInstance.isRegistered(ethAddr)) {
    //         setState(prevState => ({
    //             ...prevState,
    //             w3User: true
    //         }))
    //         let balanceOf = parseInt(await contractInstance.balanceOf(ethAddr), 16);
    //         setState(prevState => ({
    //             ...prevState,
    //             fishblnc: balanceOf
    //         }))
    //     } else {
    //         document.querySelector(".enterErrPlaceholder").textContent = "Something went wrong. Please make sure you're registered below!"
    //     }
    // }

    async function registerCall() {
        let contractInstance = await contractCall();
        if (await contractInstance.isRegistered(ethAddr)) {
            document.querySelector(".regiErrPlaceholder").textContent = "You are already registered!"
            setState(prevState => ({
                ...prevState,
                w3User: true
            }))
            let balanceOf = parseInt(await contractInstance.balanceOf(ethAddr), 16);
            setState(prevState => ({
                ...prevState,
                fishblnc: balanceOf
            }))
        }
        await contractInstance.register({ value: 1000000000, gasLimit: 12000000 });
    }


    return (
        <div className='SignUpPage'>
            <div className="step one">
                <div className="s1left">
                    <div className="h1">What is AnemonETH?</div>
                    <div className="description">We are a web3 social platform that directly rewards its users whenever they create great things</div>
                </div>
                <div className="s1right">
                    {MMConnected ? <button className="connectWalletBtn" id="done">Wallet Connected!</button> :
                    <button className="connectWalletBtn" onClick={connectWalletHandler}>Connect Wallet</button> }
                </div>
                <div className="footer"><span className="line"></span> </div>
            </div>
            <div className="step two">
                <div className="s2Top">
                    <div className="h1">Our mission: create a social platform that re-aligns incentives back to the users and away from wall street. To do this we natively and frictionlessly make each user a financial stakeholder.  <br></br><br></br>We are finally now able to benefit not just socially, but also financially from the value that our platforms create! </div>
                </div>
                <div className="s2Bottom">
                    <div className="h1 bl">If you meet a minimum threshold, you will be placed in one of three earnings tiers based on activity: low, mid or high. <br></br><br></br>Allocations will happen weekly and you decide when to redeem.  </div>
                    <div className="h1 br">After you sign-up, you don't have to manage a thing! <br></br> <br></br>If you stake, you can passively watch your FISH grow over time. </div>
                </div>
                <div className="footer"><span className="line"></span> </div>
            </div>
            <div className="step three">
                <div className="graphTitle">Our staking model is pretty simple </div>
                <img src={graph} alt="data"></img>
                <Link to="/data" className="moreData">More information can be found here</Link>
            </div>
            <div className="step four">
                <div className="footer"></div>
                <div className="s4left">
                    <div className="liTitle">
                        Registering will do great things for you:
                    </div>
                    <ul>
                        <li>Your address will be added to our smart contract </li>
                        <li>This will then be able to earn, stake and redeem FISH</li>
                        <li>You will mint yourself a unique, non-transferrable NFT</li>
                        <li>This will be used to make your profile uniquely identifiable</li>
                        <li>You will gain access to the only platform that pays you for using it!</li>
                    </ul>
                </div>
                <div className="s4right">
                    <div className="liTitle">
                        First, a few things you should know:
                    </div>
                    <ul>
                        <li>Our tokenomics will never change</li>
                        <li>Registration will cost 1 Gwei (prevents spam) and you will be given 1 FISH in return</li>
                        <li>In a given week that you earn, you will gain 1 FISH per week held</li>
                        <li>Special earnings weeks will happen periodically and redeeming during these weeks will gain you either 1, 5 or 6 extra FISH!</li>
                    </ul>
                </div>
                <div className="footer"></div>
            </div>
            <div className="step five">
                <div className="s5top">
                    <div className="okay">If that sounds fair...</div>
                </div>
                <div className="s5bottom">
                    <div className="buttonWrapper">
                        <button className="registerBtn" onClick={registerCall}>Register here!</button>
                    </div>
                </div>
            </div>
            <div className="step six">
                <div className="web2Login">
                    <div className="loginwrapper">
                        <div className="web2LoginDescription">
                            Last step, Please sign-up
                        </div>
                        <SignUpForm className="form"/>
                    </div>
                </div>
            </div>
            <div className="step seven">
                <div className="messagewrapper">
                    <div className="message">
                        Thanks for joining!<br></br> We hope it wasn't too hard. <br></br>Happy earning!
                    </div>
                </div>
                <div className="enterwrapper">
                    <Link to="/homepage" className="enterBTN">Enter the Anemone!</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
