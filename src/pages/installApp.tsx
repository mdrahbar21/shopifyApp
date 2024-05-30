import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const InstallApp = () => {
    const router = useRouter();
    const { shop } = router.query;

    useEffect(() => {
        if (shop) {
            initiateOAuthFlow(shop as string);
        }
    }, [shop]);

    const initiateOAuthFlow = (shop: string) => {
        const clientId = 'd4b88614e4678cf2a40338dcee13ee8b';
        const scopes = 'read_analytics, write_assigned_fulfillment_orders, read_assigned_fulfillment_orders, read_customer_events, write_customers, read_customers, read_discounts, write_discounts, write_discovery, read_discovery, write_draft_orders, read_draft_orders, write_files, read_files, write_fulfillments, read_fulfillments, write_gift_cards, read_gift_cards, write_inventory, read_inventory, write_legal_policies, read_legal_policies, write_locations, read_locations, write_marketing_events, read_marketing_events, write_merchant_managed_fulfillment_orders, read_merchant_managed_fulfillment_orders, write_metaobject_definitions, read_metaobject_definitions, write_metaobjects, read_metaobjects, write_online_store_navigation, read_online_store_navigation, write_online_store_pages, read_online_store_pages, write_order_edits, read_order_edits, write_orders, read_orders, write_packing_slip_templates, read_packing_slip_templates, write_payment_customizations, read_payment_customizations, write_payment_terms, read_payment_terms, write_pixels, read_pixels, write_price_rules, read_price_rules, write_product_feeds, read_product_feeds, write_product_listings, read_product_listings, write_products, read_products, write_publications, read_publications, write_purchase_options, read_purchase_options, write_reports, read_reports, write_resource_feedbacks, read_resource_feedbacks, write_returns, read_returns, write_channels, read_channels, write_script_tags, read_script_tags, write_shipping, read_shipping, write_locales, read_locales, write_shopify_credit, read_shopify_credit, write_markets, read_markets, read_shopify_payments_accounts, read_shopify_payments_bank_accounts, write_shopify_payments_disputes, read_shopify_payments_disputes, read_shopify_payments_payouts, write_content, read_content, write_store_credit_account_transactions, read_store_credit_account_transactions, read_store_credit_accounts, write_third_party_fulfillment_orders, read_third_party_fulfillment_orders, write_themes, read_themes, write_translations, read_translations, read_all_cart_transforms, write_all_checkout_completion_target_customizations, read_all_checkout_completion_target_customizations, write_cart_transforms, read_cart_transforms, read_cash_tracking, write_companies, read_companies, write_custom_fulfillment_services, read_custom_fulfillment_services, write_customer_data_erasure, read_customer_data_erasure, write_customer_merge, read_customer_merge, write_delivery_customizations, read_delivery_customizations, write_discounts_allocator_functions, read_discounts_allocator_functions, write_fulfillment_constraint_rules, read_fulfillment_constraint_rules, write_gates, read_gates, write_order_submission_rules, read_order_submission_rules, write_privacy_settings, read_privacy_settings, read_shopify_payments_provider_accounts_sensitive, write_validations, read_validations';
        const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback`);
        const state = generateState();
        const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}&grant_options[]=per-user`;

        window.location.href = authUrl;
    };

    const generateState = () => {
        const randomString = btoa(new Date().toISOString() + Math.random().toString()).substring(0, 12);
        sessionStorage.setItem('oauth_state', randomString);

        // Set the oauth_state as a cookie using js-cookie
        Cookies.set('oauth_state', randomString, {
            expires: 1 / 24, // Set the cookie to expire in 1 hour
            secure: true,
            path: '/'
        });

        return randomString;
    };

    return (
        <div>
            <h1>Initiating Installation...</h1>
            {shop && <p>Redirecting {shop} to authorization screen...</p>}
        </div>
    );
};

export default InstallApp;
