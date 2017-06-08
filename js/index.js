$(document).ready(function () {

    let following = [];

    function getAjax(url) {
        return $.ajax({
            type: "GET",
            url: url,
            headers: {
                "Client-ID": '28xq8ina4s5gqqf5v5pfaxbkwe7f5e'
            }
        })
    }

    function createHtml(logo, name, status) {
        return `
            <div class="row item">
                <div class="col-md-4">
                    <img src=${logo} />
                </div>
                <div class="col-md-4">
                    <a href="https://www.twitch.tv/${name}">${name}</a>
                </div>
                <div class="col-md-4">
                    ${status}
                </div>
            </div>
            `
    }

    function getFcc() {
        let url = "https://api.twitch.tv/kraken/streams/freecodecamp";
        getAjax(url).then(function (data) {

            if (data.stream === null) {

                $('#fccStatus')
                    .html(`Free Code Camp is Currently <span>OFFLINE</span> !`)
                    .fadeIn(500);
            } else {

                $('#fccStatus')
                    .html(`Free Code Camp is Currently <span>ONLINE</span> !`)
                    .fadeIn(500);
            }
        })
    }

    getFcc();

    function getFollower() {
        let url = "https://api.twitch.tv/kraken/users/freecodecamp/follows/channels"
        getAjax(url)
            .done(function (data) {

                let follow = data.follows;

                follow.forEach(person => {
                    let displayName = person.channel.display_name;
                    following.push(displayName);
                })
                /* add testing channel*/
                following.push('comster404');
                following.push('brunofin');
                following.push('ESL_SC2');

            })
            .done(function () {

                following.forEach(item => {
                    let url = "https://api.twitch.tv/kraken/streams/" + item;
                    getAjax(url)
                        .done(function (data) {

                            let logo;
                            let status;
                            let name;
                            if (data.stream !== null) {
                                logo = data.stream.channel.logo ? data.stream.channel.logo : '../img/timg.jpg';
                                name = data.stream.channel.display_name;
                                status = data.stream.channel.status;
                                $('#followerInfo').append(createHtml(logo, name, status));
                                $('#followerInfo .item').css({
                                    background: "green"
                                });

                            } else {
                                let url = data._links.channel;
                                getAjax(url)
                                    .done(
                                        function (data) {
                                            logo = data.logo ? data.logo : '../img/timg.jpg';
                                            name = data.display_name;
                                            status = "OFFLINE";
                                            $('#followerInfo').append(createHtml(logo, name, status));
                                        }
                                    )
                                    .fail(function () {
                                        logo = '../img/timg.jpg';
                                        name = `${item} is not found`;
                                        status = `${item} is unknow`;
                                        $('#followerInfo').append(createHtml(logo, name, status));
                                    })
                                    .done(function () {
                                        $('#followerInfo .item').fadeIn(500).css({
                                            display: "flex"
                                        });
                                    })
                            }
                        })
                })
            })
    }

    getFollower();

});