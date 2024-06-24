import { expect, test, APIRequestContext } from "@playwright/test";
import moment from "moment";
import { ApiHelper } from "../../../helper/api/apiHelper";

let token: string;
let bookingId: string;

test.beforeAll(async ({ request }) => {
  //1. Hit /Auth Api and provide username/password as body
  //2. fetch token value from JSON response
  //3. save in token variable

  const apiHelper = await new ApiHelper(request);
});

const testSuiteTestScriptObject = {
  Product_Buy_Flow:
    "Verify_that_on_the_product_page,_the_user_can_select_the_desired_attribute_of_the_product_eg_size_color_etc,Verify_that_the_user_can_add_to_the_cart_one_or_more_products,Verify_that_users_can_add_products_to_the_wishlist,Verify_that_the_user_can_see_the_previously_added_products_on_the_cart_page_after_signing_in_to_the_application,Verify_that_the_user_can_successfully_buy_more_than_one_products_that_were_added_to_his/her_cart,Verify_that_the_user_cannot_add_more_than_the_available_inventory_of_the_product,Verify_that_the_limit_to_the_number_of_products_a_user_can_buy_is_working_correctly_Also_an_error_message_gets_displayed_preventing_the_user_from_buying_more_than_the_limit,Verify_that_the_delivery_can_be_declined_during_checkout_for_the_places_where_shipping_is_not_available,Verify_that_the_Cash_on_Delivery_option_of_payment_is_working_fine,Verify_that_the_different_prepaid_methods_of_payments_are_working_fine,Verify_that_product_return_functionality_works_correctly",
  User_Registration:
    "Verify_that_all_the_required_fields__username,_email,_password,_confirm_password,_etc_are_present_on_the_registration_page,Verify_that_on_passing_valid_values,_a_user_should_get_registered_and_the_same_should_be_allowed_to_log_in_to_the_application,Verify_that_if_a_user_tries_to_register_an_existing_username_then_an_error_message_should_get_displayed,Verify_that_the_required/mandatory_fields_are_marked_with_the_‘*’_symbol,Verify_that_for_a_better_user_interface__dropdowns,_radio_buttons,_checkboxes,_etc_fields_are_displayed_wherever_possible_instead_of_just_text_boxes,Verify_the_page_has_both_submit_and_cancel/reset_buttons_at_the_end,Verify_that_clicking_submits_button_after_entering_all_the_required_fields,_submits_the_data_to_the_server,Verify_that_clicking_the_cancel/reset_button_after_entering_all_the_required_fields,_cancels_the_submit_request,_and_reset_all_the_fields,Verify_that_if_no_value_is_passed_to_the_mandatory_fields_and_submit_button_is_clicked_then_it_leads_to_a_validation_error,Verify_that_the_user_can_leave_the_optional_fields_blank_and_on_clicking_the_submit_button_no_validation_error_appears,Verify_that_whenever_possible_validation_should_take_place_on_the_client_side_For_example,_if_a_user_presses_submit_button_without_entering_a_username_and_password_then_this_validation_should_take_place_on_the_client_side_instead_of_sending_blank_entries_to_the_server,Check_the_upper_limit_of_the_different_textbox_fields,Verify_validation_on_the_date_and_email_fields_Only_valid_dates_and_valid_email_Ids_should_be_allowed,Check_validation_on_numeric_fields_by_entering_alphabets_and_special_characters,Check_that_leading_and_trailing_spaces_are_trimmed_ie_in_case,_the_user_appends_space_before_and_after_a_field,_then_the_same_should_get_trimmed_before_getting_stored_on_the_server",
  Portal_Validation:
    "Verify_that_the_company_logo_and_name_are_clearly_visible,Verify_that_the_user_is_able_to_navigate_through_all_the_products_across_different_categories,Verify_that_all_the_links_and_banners_are_redirecting_to_the_correct_product/category_pages_and_none_of_the_links_are_broken,Verify_that_all_the_information_displayed__product_name,_category_name,_price,_and_product_description_is_clearly_visible,Verify_that_all_the_images__product_and_banner_are_clearly_visible,Verify_that_category_pages_have_a_relevant_product_listed,_specific_to_the_category,Verify_that_the_correct_count_of_total_products_is_displayed_on_the_category_pages,Search__Verify_that_on_searching,_all_the_products_satisfying_the_search_criteria_are_visible_on_the_search_result_page,Search__Verify_that_on_searching,_products_get_displayed_on_the_basis_of_their_relevancy,Search__Verify_that_the_count_of_products_is_correctly_displayed_on_the_search_result_page_for_a_particular_search_term,Filtering__Verify_that_filtering_functionality_correctly_filters_products_based_on_the_filter_applied,Filtering__Verify_that_filtering_works_correctly_on_category_pages,Filtering__Verify_that_filtering_works_correctly_on_the_search_result_page,Filtering__Verify_that_the_correct_count_of_total_products_is_displayed_after_a_filter_is_applied,Filtering__Verify_that_the_correct_count_and_products_get_displayed_on_applying_multiple_filters,Sorting__Verify_that_all_the_sort_options_work_correctly_On_sorting_the_products_based_on_the_sort_option_chosen,Sorting__Verify_that_sorting_works_correctly_on_the_category_pages,Sorting__Verify_that_sorting_works_correctly_on_the_search_result_page,Sorting__Verify_that_sorting_works_correctly_on_the_pages_containing_the_filtered_result_after_applying_filters,Sorting__Verify_that_the_product_count_remains_the_same_irrespective_of_the_sorting_option_applied",
};

// for (const suiteName in testSuiteTestScriptObject) {
//   let testCaseList = testSuiteTestScriptObject[suiteName].split(",");
//   for (let iLoop = 0; testCaseList[iLoop]; iLoop++) {
//     //console.log(testCaseList[iLoop]);
//     test(`${testCaseList[iLoop]}`, async ({ request }) => {
//       const apiHelper = await new ApiHelper(request); //
//       let todayDate = new Date();
//       let env = "SIT";
//       let runid = `ecom_run_${moment().format("YYYY-MM-DD")}`; //ecom_run_02_17_2024
//       let payLoad = {
//         runid: runid,
//         suite: suiteName,
//         testcasename: testCaseList[iLoop],
//         status: "PASS",
//         env: "SIT",
//         failurereason: "",
//         duration: 10,
//         browser: null,
//         timestamp: moment().format("YYYY-MM-DD HH:mm:ss"), //"2024-03-17 16:40:48",
//         reportpath: "abc.html",
//         subscriptionkey: "clttt86dt0000mxs8a9thes2h",
//         testid: `${runid}|${suiteName}|${testCaseList[iLoop]}|${env}`,
//         executiondate: `${moment().format("YYYY-MM-DD")}`,
//       };
//       console.log("payload : ", payLoad);
//       const responseMsg = await apiHelper.invokePostApi(
//         "/api/testcase/updateTestCaseExecution",
//         payLoad
//       );
//     });
//   }
// }
