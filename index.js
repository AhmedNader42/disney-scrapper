const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');

const url = `https://www.shopdisney.co.uk/merida-framed-print-466042326193.html`;
let csrf = undefined;

axios
    .get(url, { withCredentials: true })
    .then((response) => {
        let $ = cheerio.load(response.data);
        $('input[class=csrftoken]').each(function (i, e) {
            let links = $(e).attr('value');
            csrf = links;
            console.log(csrf);
        });

        postToCart();
    })
    .catch(function (e) {
        console.log(e);
    });

function postToCart() {
    let data = {
        pid: 466042326193,
        Quantity: 1,
        csrf_token: csrf,
    };

    axios
        .post('https://www.shopdisney.co.uk/on/demandware.store/Sites-disneyuk-Site/en_GB/Product-AddedToCart?pid=466042326193', qs.stringify(data), {
            withCredentials: true,
        })
        .then((response) => {
            // console.log(response)
            goToBag();
        })
        .catch((err) => {
            console.log(err);
        });
}

function goToBag() {
    axios.get('https://www.shopdisney.co.uk/bag', { withCredentials: true }).then((response) => {
        // console.log(response);
        let $ = cheerio.load(response.data);
        $('span[class=bag-count]').each(function (i, e) {
            let links = $(e);
            console.log(links);
        });
    });
}

/* s_ptc=0.58%5E%5E0.00%5E%5E0.15%5E%5E0.16%5E%5E0.30%5E%5E0.08%5E%5E9.40%5E%5E0.09%5E%5E10.69;
 cqcid=abxf7c367rmFMyEVTka7DvJpPk;
  dwanonymous_4b4f41ef658a5f7622324979f744826c=abxf7c367rmFMyEVTka7DvJpPk;
   __cq_dnt=0;
    dw_dnt=0;
     uvtddl=1;
      __cq_uuid=abxf7c367rmFMyEVTka7DvJpPk;
       BVBRANDID=ed1c08b4-c673-4131-bc5b-a49a5eaa4ded;
        DisneyCookieConsentChecksum=-958423543;
         device_11a2d642=a5117832-e00b-4428-9737-c129d959050a;
          WDI-UK.TDS.AB3.NONBRANDED.WEB-PROD-ac=XEG;
           dwac_cdYLkiaagQNQ6aaadqpRAb3HPZ=h4N1k9QtL3CaBD_xrOqLgxBWnNIo8b6TVTM%3D|dw-only|90690411||GBP|false|Europe%2FLondon|true; cquid=MCKnKRXiUrXnjn4ux9758RE4VvK0Hpeh5pQ6KYKhAGg=|fcc8560e72dc255da81a38b1cfc8262aa3573dcbdd82414598bccfa35a6436e7|c08073338ff5f83f2aa2e8fb39fc3a8a7148d08330f002add94e615c09637aae; userRecognised=true; __cq_seg=0~0.02!1~-0.44!2~0.05!3~-0.10!4~0.10!5~-0.75!6~-0.22!7~-0.37!8~0.16!9~0.05; dwsid=m1BW-iv-ahVDDrDxbeXplfq95tp3qqSC4yYE--8LUuvwpMBGhi3nN8zBqrFkrYKooUuE_ywzsOKIIAnImm_Rjg==; sid=uWemLq-UyoxvlF0WbMLlGdiKFg7zwAQbz7w; SWID=edacec61-aec2-4782-a7b2-7579c04b2ee4; WDI-UK.TDS.AB3.NONBRANDED.WEB-PROD.api=6mgpPUP16u3cd+z9AKhYAyxwJP/Vc+6zHIhZCgLpCYDKGbROJG0M2pTF7L1wD4l+FHKAjC/+0Mral1uDVibDVu3kYRNzZJx+mHGq5BA+Zc5g6A==; __cq_bc=%7B%22aamz-disneyuk%22%3A%5B%7B%22id%22%3A%22466042326193%22%7D%2C%7B%22id%22%3A%22%22%2C%22type%22%3A%22set%22%2C%22alt_id%22%3A%222841046480018PS%22%7D%2C%7B%22id%22%3A%222841047080168M%22%7D%5D%7D; BVBRANDSID=fc9130b8-68d4-43ea-9dc3-23c76cf5706e; CONSENTMGR=c1:0%7Cc2:0%7Cc3:0%7Cc4:0%7Cc5:0%7Cc6:1%7Cc17:1%7Cc18:0%7Cc19:0%7Cc20:0%7Cc21:0%7Cc23:0%7Cc24:0%7Cc25:0%7Cc26:0%7Cc27:1%7Cc28:0%7Cc29:1%7Cc30:1%7Cc31:0%7Cc37:0%7Cc38:0%7Cts:1624391146782%7Cconsent:true;
            utag_main=v_id:017a3485be1a000a22dfcff9aac20307900690710093c$_sn:1$_se:201$_ss:0$_st:1624392946784$ses_id:1624378818075%3Bexp-session$_pn:91%3Bexp-session$_prevpage:shopdisney%3Adepartments%3Amerida%20framed%20print%3Bexp-1624394746791

 */
