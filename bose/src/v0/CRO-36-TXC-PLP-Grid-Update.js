(function () {

    const EXPERIMENT_PREFIX = 'exp_36';

    function track(action, optlabel = null) {

        const params = {
            'acn_eventaction': action,
            'acn_eventcategory': EXPERIMENT_PREFIX,
            'event': 'acn_experience'
        };

        if (optlabel) {
            params.acn_eventlabel = optlabel
                .toLowerCase()
                .replaceAll(' ', '_')
                .replaceAll("'", '');

        }

        dataLayer.push(params);
    }

    function customGoals() {
        // Top Filter Clicks  v0, v1   
        // This should fire when a user clicks on any of the filter CTAs at the top of the PLP and the event label should change based on the name of the specific filter clicked. 
        document.querySelectorAll('.refinements__categories__button').forEach(pill => {
            pill.addEventListener('click', e => { track('top_filter', e.target.innerText); });
        });

        document.querySelector('#product-search-results').addEventListener('click',(e)=>{
            // Filter Click  v0, v1   
            // This should fire when a user clicks on the filter icon on the top left of the PLP cards to open the filters.
            if(e.target.closest('#flyout-filter_button-open')){ track('open_filter'); }

            // Sort Click     v0, v1 
            // This should fire when a user clicks on the sort icon on the top right of the PLP cards to open the sorting.
            else if(e.target.closest('#flyout-sorting_button-open')){ track('open_sort');  }
        })

        document.querySelector('.product-grid').addEventListener('click',(e)=>{
            // Discover CTA Clicks v0, v1 
            // This should fire when a user clicks on any CTA on the PLPs that says “Discover” 
            if(e.target.getAttribute('title') === "DISCOVER" || e.target.getAttribute('title') === "Discover"){ track('discover_cta'); }

            // Wishlist Click    v0, v1 
            // This should fire when a user clicks on the little heart on the product tiles to add the product to wishlist. 
            else if(e.target.className === 'bif bif-love'){ track('wishlist_click'); }

            // Load More Click   v0, v1 
            // This should fire when a user clicks on load more CTA at the bottom of the PLP 
            else if(e.target.className === 'btn btn-primary more btn-plp-more'){ track('load_more'); }
        });

        document.querySelector('.content-grid__page-slot-wrapper').addEventListener('click',(e)=>{
            // Product Compare View Product   v0, v1 
            // This should fire when a user clicks on "view product” on any of the products in the product comparison section at the bottom of the PLP
            if(e.target.className === 'btn btn-secondary btn-sm view-product'){ track('product_compare', 'view_product'); }
            
            // Product Compare Color   v0, v1 
            // This should fire when a user clicks on the color options in the product compare section at the bottom of the PLP
            else if(e.target.classList.contains('swatch__image')){ track('product_compare', 'choose_color'); }
        });

    }

    function apply(context, template) {

        const contentZoneSelector = Evergage.getContentZoneSelector(context.contentZone);
        return Evergage.DisplayUtils
            .pageElementLoaded(contentZoneSelector)
            .then((element) => {
                const html = template(context);
                Evergage.cashDom(element).html(html);

                customGoals();
            });
    }

    function reset(context, template) {

        /** Remove the template from the DOM to reset the template. */
        Evergage.cashDom("#evg-new-template").remove();
    }

    function control(context) {

        const contentZoneSelector = Evergage.getContentZoneSelector(context.contentZone);
        return Evergage.DisplayUtils
            .pageElementLoaded(contentZoneSelector)
            .then((element) => {
                Evergage.cashDom(element).attr({
                    "data-evg-campaign-id": context.campaign,
                    "data-evg-experience-id": context.experience,
                    "data-evg-user-group": context.userGroup
                });
            });
    }

    registerTemplate({
        apply: apply,
        reset: reset,
        control: control
    });

})();