

App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    hasVoted: false,

    init: function () {
        return App.initWeb3();
    },

    initWeb3: function () {
        // TODO: refactor conditional
        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
            console.log("obteniendo provider")
        } else {
            // Specify default instance if no web3 instance provided
            var data = new Date();

            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            
            web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
    },

    initContract: function () {
        //console.log("obteniendo json election")
        //fs.readFile('../../build/contracts/Election.json', 'utf8', (err, data) => {
        //    if (err) throw err;
        //    print(JSON.parse(data));
        //});
        fetch("http://172.20.10.4:3002/getJson")
        .then(Response => Response.json())
        .then(data => {
            console.log(data);
            // or whatever you wanna do with the data
            console.log("obteniendo json election local")
            // Instantiate a new truffle contract from the artifact
            App.contracts.Election = TruffleContract(data);
            // Connect provider to interact with contract
            App.contracts.Election.setProvider(App.web3Provider);

            //App.listenForEvents();

            return App.render();
        }).catch(function (error) {
            fetch("http://172.20.10.4:3002/getJson")
            .then(Response => Response.json())
            .then(data => {
                console.log(data);
                // or whatever you wanna do with the data
                console.log("obteniendo json election externa")
                // Instantiate a new truffle contract from the artifact
                App.contracts.Election = TruffleContract(data);
                // Connect provider to interact with contract
                App.contracts.Election.setProvider(App.web3Provider);

                //App.listenForEvents();

                return App.render();
            }).catch(function (error) {
                
                console.warn(error);
            });
            console.warn(error);
        });

        //$.getJSON("Election.json", function (election) {
            
        //});
    },

    //Listen for events emitted from the contract
    listenForEvents: function () {
        App.contracts.Election.deployed().then(function (instance) {
            // Restart Chrome if you are unable to receive this event
            // This is a known issue with Metamask
            // https://github.com/MetaMask/metamask-extension/issues/2393
            instance.votedEvent({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function (error, event) {
                console.log("event triggered", event)
                // Reload when a new vote is recorded
                App.render();
            });
        });
    },

    render: function () {
        var electionInstance;
        var loader = document.getElementById("loader");//$("#loader");
        var content = document.getElementById("content")//$("#content");
        loader.style.display = "none";
        content.style.display = "block";

        //loader.show();
        //content.hide();

        // Load account data
        web3.eth.getCoinbase(function (err, account) {
            if (err === null) {
                App.account = account;
                $("#accountAddress").html("<span id='accountTag'>Your Account :</span> <span id='myAccount'>" + account + "</span>");
            }
        });

        // Load contract data
        App.contracts.Election.deployed().then(function (instance) {
            electionInstance = instance;
            return electionInstance.candidatesCount();
        }).then(function (candidatesCount) {
            var candidatesResults = $("#candidatesResults");
            candidatesResults.empty();  

            var candidatesSelect = $('#candidatesSelect');
            candidatesSelect.empty();

            for (var i = 1; i <= candidatesCount; i++) {
                electionInstance.candidates(i).then(function (candidate) {
                    var id = candidate[0];
                    var name = candidate[1];
                    var voteCount = candidate[2];

                    // Render candidate Result
                    var candidateTemplate = "<tr><td>" + id + "</td><td>" + name + "</td><td>" + voteCount + "</td></tr>"
                    candidatesResults.append(candidateTemplate);

                    // Render candidate ballot option
                    var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
                    candidatesSelect.append(candidateOption);
                });
            }
            return electionInstance.voters(App.account);
        }).then(function (hasVoted) {
            // Do not allow a user to vote
            if (hasVoted) {
                $('form').hide();
                $("#voteStatus").show();
            }
            loader.hide();
            content.show();
            
        }).catch(function (error) {
            console.warn(error);
        });
    },

    castVote: function () {
        var candidateId = $('#candidatesSelect').val();
        App.contracts.Election.deployed().then(function (instance) {

            // Obtenemos la identidad del usuario de MetaMask
            const userAccount = web3.eth.accounts[0];
            console.log("Nueva variable",userAccount)
            console.log("Antigua variable",App.account)

            return instance.vote(candidateId, { from: App.account });
        }).then(function (result) {
            // Wait for votes to update
            if(result != null){
                console.log(result)
                window.location.reload();
            }
            //$("#content").hide();
            //$("#loader").show();
        }).catch(function (err) {
            console.error(err);
        });
    }
};

$(function () {
    $(window).load(function () {
        console.log("iniciando")
        App.init();
    });
});
