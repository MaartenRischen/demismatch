"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { glossaryById } from "@/data/glossaryData";

interface TileData {
  id: number;
  question: string;
  answer: string;
  imageUrls: string[];  // Array of 5 image URLs for gallery
}

// Image mappings for each question - Auto-generated from valid folders only
// Excluded folders: the_sequencing, meaning_purpose_sacred_100_prompts_v2, the_same_scene_two_eyes,
// the_trap_recognized, utopia_100_prompts, dashboard_calibrated_series, the_bridge_series, the_lies_we_tell,
// the_mismatch_answer_100_demismatch_tech_vol6, the_mismatch_answer_100_real_thing_vol7, the_mismatch_answer_100_vol3,
// dystopia_100_prompts, money_consumption_status_100_prompts, the_mismatch_actually_100_everyone_wrong_vol11
// imageMap now holds arrays of 5 URLs for gallery display
// Initially using placeholders - run the image selector tool to pick 5 unique images per question
const imageMap: Record<number, string[]> = {   1: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/2_THE_LONELY_APARTMENT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/5_THE_BURNOUT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/73_THE_DEPRESSION_DIAGNOSTIC.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/19_THE_ANXIETY.png'
  ],   2: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/100_THE_MODERN_CONDITION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/21_THE_CROWD_OF_STRANGERS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/10_THE_COMMUTE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/51_THE_SCROLL_HOLE.png'
  ],   3: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/90_THE_RUMINATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/12_THE_OVERTHINKING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/22_THE_NEWS_ADDICTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/53_THE_FEAR_FEED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/38_THE_GLOBAL_THREAT.png'
  ],   4: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/36_THE_COMPLETION_CEREMONY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/32_THE_MEANINGFUL_PROJECT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/21_THE_VISIBLE_CONTRIBUTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/83_THE_THING_SHIPPED.png'
  ],   5: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/2_THE_STATUS_SCAN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/1_THE_HIERARCHY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/20_THE_SOCIAL_ANXIETY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/22_THE_AUDIENCE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/23_THE_JUDGMENT.png'
  ],   6: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_scale_matters/14_THE_SOCIAL_NETWORK.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/11_THE_150.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/14_THE_STRANGER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/21_THE_CROWD_OF_STRANGERS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/22_THE_TRIBE_THAT_ISN_T.png'
  ],   7: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/21_THE_CROWD_OF_STRANGERS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/91_THE_REAL_TRIBE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/84_THE_BRAND_TRIBE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/20_THE_PARASOCIAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/2_THE_LONELY_APARTMENT.png'
  ],   8: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/11_THE_SOCIAL_MEDIA_COMPARISON.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/30_THE_PARASOCIAL_BOND.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/30_THE_PARASOCIAL_RELATIONSHIP.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/58_THE_PARASOCIAL_BLOCK.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_demismatch_tech_vol6/92_THE_RUNNING_APP_SOCIAL.png'
  ],   9: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/74_THE_BELONGING_SIGNALS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/63_THE_BUSINESS_VERIFIED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/56_THE_BOREDOM_INTOLERANCE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/43_THE_BOREDOM_TOLERANCE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dating_mating_100_prompts_final2/69_THE_BUSINESS_TRIP.png'
  ],   10: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100/23_THE_MONEY_TALK_AVOIDANCE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/39_THE_SMALL_GAME.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/30_THE_SMALL_TALK.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/30_THE_PERFECTIONISM.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/35_THE_MONEY_ABSTRACTION.png'
  ],   11: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/16_THE_DEPRESSION_SIGNAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/74_THE_BURNOUT_SIGNAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/17_THE_ANXIETY_SIGNAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/74_THE_BELONGING_SIGNALS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/2_THE_SIGNAL.png'
  ],   12: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/74_THE_ENVIRONMENT_DESIGN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/97_THE_ENVIRONMENT_ENGINEERING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/68_THE_ANXIETY_MEDICATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/5_THE_STATUS_ANXIETY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/70_THE_GROUP_TEXT_ANXIETY.png'
  ],   13: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/74_THE_BELONGING_SIGNALS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/20__IT_S_DIFFERENT_FOR_YOU_.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/46_THE_STATUS_DIFFERENTIAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/59_THE_FERTILITY_TREATMENT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/38_THE_ANXIETY_DIAGNOSIS.png'
  ],   14: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/9_THE_PROCESSED_ENGINEERING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_demismatch_tech_vol6/37_THE_THERAPY_LIGHT_GLASSES.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/42_THE_MICROBIOME_ENGINEERING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/32_THE_ENGINEERING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/6_THE_FLIGHT.png'
  ],   15: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/68_THE_ANXIETY_MEDICATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/5_THE_STATUS_ANXIETY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/21_THE_CROWD_OF_STRANGERS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/72_THE_STATUS_ANXIETY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/70_THE_GROUP_TEXT_ANXIETY.png'
  ],   16: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/53_THE_MEANINGLESS_JOB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/32_THE_MEANINGFUL_PROJECT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/21_THE_VISIBLE_CONTRIBUTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/21_THE_CONTRIBUTION_VISIBLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/26_THE_WORK_VISIBLE.png'
  ],   17: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/74_THE_ENVIRONMENT_DESIGN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/97_THE_ENVIRONMENT_ENGINEERING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/72_THE_WATER_SECURED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/17_THE_WATER_SWIMMING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/67_THE_WATER_IMMERSION.png'
  ],   18: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/74_THE_ENVIRONMENT_DESIGN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/91_THE_WRONG_PATH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/97_THE_ENVIRONMENT_ENGINEERING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/68_THE_ANXIETY_MEDICATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/58_THE_MEDICATION_SHAME.png'
  ],   19: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/98_THE_WALK_WITHOUT_DESTINATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/10_THE_MORNING_WITHOUT_BREAKFAST.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/53_THE_MEANINGLESS_JOB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/32_THE_MEANINGFUL_PROJECT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/21_THE_VISIBLE_CONTRIBUTION.png'
  ],   20: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/58_THE_GATHERING_OF_BANDS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_positive_vol4/22_THE_SHARED_MEAL_WARMTH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/91_THE_LANGUAGE_SHARED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/58_THE_SHARED_GRIEF.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/39_THE_SMALL_GAME.png'
  ],   21: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/98_THE_WALK_WITHOUT_DESTINATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/10_THE_MORNING_WITHOUT_BREAKFAST.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/hoffman_interface_theory_series/42_THE_OBJECT_DISSOLVES.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/115_THE_PUZZLE_SOLVED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/36_THE_PROBLEM_SOLVED.png'
  ],   22: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/68_THE_ANXIETY_MEDICATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/5_THE_STATUS_ANXIETY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/72_THE_STATUS_ANXIETY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/22_THE_AUDIENCE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/70_THE_GROUP_TEXT_ANXIETY.png'
  ],   23: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/16_THE_MISSING_SQUAT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/26_THE_MISSING_TOUCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/61_THE_PARENTING_SUPPORT_NETWORK.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/81_THE_ALWAYS-ON.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/82_THE_DISTANT_THREAT.png'
  ],   24: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/8_THE_NEVER_ENOUGH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/64_THE_NEVER_ENOUGH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/82_THE_GRANDMOTHER_HOLDS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/3_THE_RELATIVE_POSITION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/100_THE_ENOUGH.png'
  ],   25: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/68_THE_ANXIETY_MEDICATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/5_THE_STATUS_ANXIETY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/70_THE_GROUP_TEXT_ANXIETY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/20_THE_SOCIAL_ANXIETY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/15_THE_FERTILITY_ANXIETY.png'
  ],   26: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/17_THE_PEOPLE_DREAD.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/2_THE_KITCHEN_FULL_OF_PEOPLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/94_THE_PEOPLE_PLEASING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/8_THE_PEOPLE_WHO_MATTER.png'
  ],   27: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/94_THE_PEOPLE_PLEASING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/2_THE_KITCHEN_FULL_OF_PEOPLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/17_THE_PEOPLE_DREAD.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/8_THE_PEOPLE_WHO_MATTER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/32_THE_MEANINGFUL_PROJECT.png'
  ],  28: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/44_THE_ACHIEVEMENT_HOLLOW.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/44_THE_ACHIEVEMENT_HOLLOW.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/44_THE_ACHIEVEMENT_HOLLOW.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/44_THE_ACHIEVEMENT_HOLLOW.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/44_THE_ACHIEVEMENT_HOLLOW.png'
  ],   29: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/100_THE_MODERN_CONDITION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/53_THE_MEANINGLESS_JOB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/24_THE_INVISIBLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/59_THE_INVISIBLE_CHAINS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/17_THE_ELDER_RECONNECT.png'
  ],   30: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/26_THE_BULLSHIT_JOB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/76_THE_BULLSHIT_JOB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/39_THE_BULLSHIT_JOB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/21_THE_VISIBLE_CONTRIBUTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/21_THE_CONTRIBUTION_VISIBLE.png'
  ],   31: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/21_THE_CROWD_OF_STRANGERS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/14_THE_STRANGER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/87_THE_NEIGHBORHOOD_STRANGER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/15_THE_STRANGER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/11_THE_STRANGER_DANGER.png'
  ],   32: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/31_THE_DAILY_NECESSITY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/66_THE_ANIMAL_ENCOUNTER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/45_THE_DAILY_PRACTICE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/21_THE_CROWD_OF_STRANGERS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/6_THE_KNOWN_BY_ALL.png'
  ],   33: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/50__YOU_JUST_NEED_TO_LOVE_YOURSELF_.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/2_THE_KITCHEN_FULL_OF_PEOPLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dystopia_100_prompts/1_THE_EIGHT_BILLION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/17_THE_PEOPLE_DREAD.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/71_THE__70_BILLION.png'
  ],   34: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/86_THE_FITNESS_INFLUENCER_COMPARISON.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/2_THE_STATUS_SCAN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/97_THE_LOCAL_STATUS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/23_THE_STATUS_LOCAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/72_THE_STATUS_RECOGNITION.png'
  ],   35: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/11_THE_SOCIAL_MEDIA_COMPARISON.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/52_THE_SOCIAL_TOUCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_demismatch_tech_vol6/83_THE_VIRTUAL_REALITY_NATURE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_demismatch_tech_vol6/92_THE_RUNNING_APP_SOCIAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/2_THE_SUGAR_HIJACK.png'
  ],   36: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/86_THE_VOICE_HEARD.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/20_THE_PARASOCIAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/30_THE_PARASOCIAL_BOND.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/30_THE_PARASOCIAL_RELATIONSHIP.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/58_THE_PARASOCIAL_BLOCK.png'
  ],   37: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/41_THE_PURPOSE_VACANCY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/45_THE_PURPOSE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/90_THE_PURPOSE_CLARIFICATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/8_THE_PURPOSE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/30_THE_PURPOSE_CLEAR.png'
  ],   38: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/66_THE_APP_BLOCKED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/26__MONEY_CAN_T_BUY_HAPPINESS_.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_demismatch_tech_vol6/41_THE_APP_BLOCKER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/87_THE_HEALTH_PROXY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/47__TIME_IS_MONEY_.png'
  ],   39: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/59_THE_COMMUNITY_CURRENCY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/91_THE_EATING_ALONE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/3_THE_COMMUNITY_LAND_TRUST.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_real_thing_vol7/48_THE_CHURCH_COMMUNITY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_demismatch_tech_vol6/15_THE_COMMUNITY_GARDEN.png'
  ],   40: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/11_THE_SOCIAL_MEDIA_COMPARISON.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/60_THE_PHANTOM_VIBRATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/9_THE_PHANTOM_VIBRATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/46_THE_NOTIFICATION_CURATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_demismatch_tech_vol6/92_THE_RUNNING_APP_SOCIAL.png'
  ],   41: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/61_THE_DOPAMINE_EXHAUSTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/60_THE_CHRONIC.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/17_THE_CHRONIC.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100/80_THE_ANTICIPATION_EXHAUSTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/60_THE_CHRONIC_ILLNESS_GUILT.png'
  ],   42: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/30_THE_PARASOCIAL_BOND.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/30_THE_PARASOCIAL_RELATIONSHIP.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/58_THE_PARASOCIAL_BLOCK.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/20_THE_PARASOCIAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/11_THE_SOCIAL_MEDIA_COMPARISON.png'
  ],   43: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/1_THE_CHEMICAL_IMBALANCE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/16_THE_DEPRESSION_SIGNAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_everyone_wrong_vol11%20%281%29/94_THE_CHEMICAL_IMBALANCE__FOLK_VERSION_.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/83_THE_DEPRESSION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/55_THE_CHRISTMAS_DEPRESSION.png'
  ],   44: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/68_THE_ANXIETY_MEDICATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/58_THE_MEDICATION_SHAME.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/74_THE_BELONGING_SIGNALS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/42_THE_MICROBIOME_ENGINEERING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/2_THE_SIGNAL.png'
  ],   45: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/1_THE_CHEMICAL_IMBALANCE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_everyone_wrong_vol11%20%281%29/94_THE_CHEMICAL_IMBALANCE__FOLK_VERSION_.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/hoffman_interface_theory_series/37_THE_CHEMICAL_HACK.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_everyone_wrong_vol11%20%281%29/60_THE_CHEMICAL_CURE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/50_THE_CHEMICAL_CRUTCH.png'
  ],   46: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/28_THE_WEATHER_UNDERSTOOD.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/59_THE_LETTER_WRITTEN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/1_THE_UNDERSTANDING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_positive_vol4/6_THE_UNDERSTOOD_FEELING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_real_thing_vol7/81_THE_SONG_WRITTEN.png'
  ],   47: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/51_THE_CORTISOL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/62_THE_CORTISOL_DRIP.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/99_THE_NOTIFICATION_STRESS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/38_THE_STRESS_RESPONSE_MODULATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/100_THE_MODERN_CONDITION.png'
  ],   48: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/75_THE_BODY_KEEPS_SCORE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/63_THE_CLOSET.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/8_THE_NEVER_ENOUGH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/95_THE_ENCLOSED.png'
  ],   49: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/23_THE_SUGAR_CRAVING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/basics_of_the_mismatched_human/the_sugar_craving.jpeg',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/31_THE_BLISS_POINT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/3_THE_CRAVING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/basics_of_the_mismatched_human/the_pregnancy_craving.jpeg'
  ],   50: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/49_THE_MULTIGENERATIONAL_DESIGNED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/7_THE_DATING_APP.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/4_THE_DATING_APP.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/60_THE_PHANTOM_VIBRATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/9_THE_PHANTOM_VIBRATION.png'
  ],   51: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dating_mating_100_prompts_final2/23_THE_NOVELTY_DRIVE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/basics_of_the_mismatched_human/the_dual_mating_strategy.jpeg',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/52_THE_LONG_PARTNERSHIP.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/86_THE_PARTNERSHIP.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/61_THE_PARTNERSHIP_REAL.png'
  ],   52: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/70_THE_SABBATH_PRACTICE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/59_THE_EYE_CONTACT_HELD.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/74_THE_BELONGING_SIGNALS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/67_THE_MUTUAL_AID_COORDINATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/12_THE_ALLIANCE_DISPLAY.png'
  ],   53: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/72_THE_STATUS_RECOGNITION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/2_THE_STATUS_SCAN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/97_THE_LOCAL_STATUS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/20_THE_PARASOCIAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/30_THE_PARASOCIAL_BOND.png'
  ],   54: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/91_THE_LANGUAGE_SHARED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/58_THE_SHARED_GRIEF.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_real_thing_vol7/56_THE_SHARED_HOUSE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/43_THE_SHARED_BURDEN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/63_THE_JOY_SHARED.png'
  ],   55: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/47_THE_MONEY_SHAME.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/35_THE_MONEY_ABSTRACTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/24_THE_KNOWLEDGE_DOWNLOAD.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/19_THE_COMMON_ENEMY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/74_THE_KNOWLEDGE_BACKED_UP.png'
  ],   56: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_demismatch_tech_vol6/60_THE_ACCOUNTABILITY_PARTNER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/99_THE_ACCOUNT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/36_THE_PROBLEM_SOLVED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_vol3/4_THE_FINISHING_PROBLEM.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/10_THE_ANGER_PROBLEM.png'
  ],   57: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/55_THE_MATCHMAKING_ALGORITHM.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/99_THE_MAKING_FOR_FUN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/28__THERE_S_NEVER_BEEN_A_BETTER_TIME_TO_BE_ALIVE_.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/63_THE_FIRE_MAKING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/64_THE_TOOL_MAKING.png'
  ],   58: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/7_THE_IRRATIONAL_FEAR.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/56_THE_ANXIETY_AS_PREPARATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/62_THE_ELDER_INTEGRATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/64_THE_CELEBRATION_COORDINATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/43_THE_ASPIRATION.png'
  ],   59: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/51_THE_LONELINESS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/78_THE_MALE_LONELINESS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100/33_THE_CROWDED_LONELINESS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/70_THE_LONELINESS_STIGMA.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/91_THE_DEATH_AWARENESS.png'
  ],   60: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/43_THE_GAMING_ADDICTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/8_THE_INTEREST_MATCHED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/22_THE_NEWS_ADDICTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/19_THE_PORN_ADDICTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/39_THE_MENTOR_MATCHED.png'
  ],   61: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/72_THE_ANXIETY_DISORDER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/84_THE_CLEAN_EATING_DISORDER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/82_THE_FIRE_BUILT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/48_THE_EATING_DISORDER_THOUGHTS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/14_THE_PERSONALITY_DISORDER.png'
  ],  62: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png'
  ],   63: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/20_THE_SOCIAL_ANXIETY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/basics_of_the_mismatched_human/the_social_anxiety.jpeg',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/68_THE_ANXIETY_MEDICATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/5_THE_STATUS_ANXIETY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/21_THE_CROWD_OF_STRANGERS.png'
  ],   64: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/53_THE_MEANINGLESS_JOB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/21_THE_VISIBLE_CONTRIBUTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/21_THE_CONTRIBUTION_VISIBLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/26_THE_WORK_VISIBLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/24_THE_INVISIBLE.png'
  ],   65: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/17_THE_IMPOSTER_SYNDROME.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/basics_of_the_mismatched_human/the_imposter_syndrome.jpeg',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/21_THE_VISIBLE_CONTRIBUTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/21_THE_CONTRIBUTION_VISIBLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/26_THE_WORK_VISIBLE.png'
  ],   66: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_everyone_wrong_vol11%20%281%29/13_THE_SUFFERING_VIRTUE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/71_THE_TERROR.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/20_THE_MEDICAL_ERROR.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/48_THE_RARE_DISEASE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/13_THE_TERRORISM.png'
  ],   67: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/91_THE_HEIGHTS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/70_THE_INHERITED_FEAR.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/48_THE_RARE_DISEASE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/18_THE_HEART_DISEASE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/73_THE_FOOD_PRESERVED.png'
  ],   68: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/46_THE_STATUS_DIFFERENTIAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/20__IT_S_DIFFERENT_FOR_YOU_.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/97_THE_CONTENT_BRAIN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dating_mating_100_prompts_final2/97_THE_PORN_BRAIN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_vol3/74_THE_ANGER_AT_SLOW_DRIVERS.png'
  ],   69: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/17_THE_BRAIN-COMPUTER_INTERFACE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/97_THE_CONTENT_BRAIN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dating_mating_100_prompts_final2/97_THE_PORN_BRAIN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_everyone_wrong_vol11%20%281%29/14_THE_GENDER_BRAIN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/24_THE_COST-BENEFIT_BRAIN.png'
  ],   70: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/32_THE_THERAPY_TREADMILL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/86_THE_THERAPY_SPEAK_BREAKUP.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/77_THE_PSYCHEDELIC_THERAPY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_scale_matters/42_THE_THERAPY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/24_THE_COUPLES_THERAPY.png'
  ],   71: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/8_THE_NEVER_ENOUGH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/64_THE_NEVER_ENOUGH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/100_THE_ENOUGH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/80_THE_ENOUGH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/13__YOU_RE_NOT_TRYING_HARD_ENOUGH_.png'
  ],   72: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/68_THE_ANXIETY_MEDICATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/58_THE_MEDICATION_SHAME.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/6_THE_SOCIAL_PREDICTION_AI.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/20_THE_PARASOCIAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/47_THE_SOCIAL_PROOF.png'
  ],   73: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/47_THE_BEFORE_AFTER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/96_THE_BODY_AFTER_BABY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/94_THE_PEOPLE_PLEASING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/6_THE_BUY_NOTHING_GROUP.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/98_THE_WALK_WITHOUT_DESTINATION.png'
  ],   74: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/1_THE_MIDNIGHT_SCROLL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/37__EVERYTHING_HAPPENS_FOR_A_REASON_.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/1_THE_MIDNIGHT_SCROLL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/100_THE_EVERYTHING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/basics_of_the_mismatched_human/the_midnight_snack.jpeg'
  ],   75: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/61_THE_PARENTAL_LOVE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dating_mating_100_prompts_final2/4_THE_PARENTAL_INVESTMENT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/74_THE_HOBBY_BURNOUT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/78_THE_MILLENNIAL_BURNOUT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/63_THE_DATING_BURNOUT.png'
  ],   76: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/11_THE_CHILDREN_S_BIRTHDAY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/83_THE_CHILDREN_S_SCREEN_TIME.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_positive_vol4/77_THE_LEARNING_FROM_ELDER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/17_THE_CHILDREN_UNDERFOOT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/87_THE_CHILDREN.png'
  ],   77: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/21_THE_VISIBLE_CONTRIBUTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/21_THE_CONTRIBUTION_VISIBLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/26_THE_WORK_VISIBLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/24_THE_INVISIBLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/36_THE_YOUTUBE_APPRENTICESHIP.png'
  ],   78: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/91_THE_LANGUAGE_SHARED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/9_THE_SHARED_PLATE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/58_THE_SHARED_GRIEF.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_real_thing_vol7/56_THE_SHARED_HOUSE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/43_THE_SHARED_BURDEN.png'
  ],   79: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_everyone_wrong_vol11%20%281%29/20_THE_TEN_THOUSAND_HOURS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/3_THE_HUNGER_BEFORE_THE_MEAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/47_THE_BEFORE_AFTER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/16_THE_EFFORT.png'
  ],   80: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_scale_matters/31_THE_LEADERSHIP.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/20__IT_S_DIFFERENT_FOR_YOU_.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_everyone_wrong_vol11%20%281%29/77_THE_LEADERSHIP_TRAITS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/46_THE_STATUS_DIFFERENTIAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/19_THE_PERSONAL_AI_ASSISTANT.png'
  ],   81: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_50_status_game_vol9/6_THE_DOMINANCE_GAME.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/6_THE_DOMINANCE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/59_THE_DOMINANCE_DISPLAY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/14_THE_DOMINANCE_PATH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/11_THE_COALITION.png'
  ],   82: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/54_THE_CONFLICT_RESOLUTION_AI.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/38_THE_CONFLICT_AVOIDANCE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/basics_of_the_mismatched_human/the_in_law_conflict.jpeg',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/18_THE_CONFLICT_REPAIR.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/53_THE_REPUTATION_SYSTEM.png'
  ],   83: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/1_THE_MORNING_LIGHT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/6_THE_FLIGHT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/18_THE_BLUE_LIGHT_BATH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/124_THE_LIGHT_DIMMED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/51_THE_SUNLIGHT_DOSE.png'
  ],   84: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/11_THE_CHILDREN_S_BIRTHDAY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100/6_THE_BIRTHDAY_DREAD.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_scale_matters/28_THE_BIRTH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/126_THE_BIRTHDAY_SUNG.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/83_THE_CHILDREN_S_SCREEN_TIME.png'
  ],   85: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/11_THE_CHILDREN_S_BIRTHDAY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_scale_matters/28_THE_BIRTH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/126_THE_BIRTHDAY_SUNG.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/24_THE_BIRTH_WITNESSED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_real_thing_vol7/31_THE_BIRTH_WITNESSED.png'
  ],   86: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_positive_vol4/52_THE_SLEEP_SATISFACTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/54_THE_CONFLICT_RESOLUTION_AI.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/32_THE_METABOLISM_CONTROL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/6_THE_SOCIAL_PREDICTION_AI.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/46_THE_PROMISE_BREAKER.png'
  ],   87: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/33_THE_SEXLESS_MARRIAGE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/51_THE_MUTUAL_AID_NETWORK.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/16_THE_ALLOPARENT_NETWORK.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/73_THE_AVOIDANCE_RELIEF.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100/85_THE_NEWS_AVOIDANCE.png'
  ],   88: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/100_THE_MODERN_CONDITION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/2_THE_KITCHEN_FULL_OF_PEOPLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/17_THE_PEOPLE_DREAD.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/68_THE_COLLECTIVE_GOVERNANCE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/94_THE_PEOPLE_PLEASING.png'
  ],   89: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/91_THE_REAL_TRIBE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/84_THE_BRAND_TRIBE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/22_THE_TRIBE_THAT_ISN_T.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/35__FIND_YOUR_TRIBE_ONLINE_.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dystopia_100_prompts/5_THE_TRIBE_SIMULATED.png'
  ],   90: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/86_THE_FITNESS_INFLUENCER_COMPARISON.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/47_THE_INFLUENCER_ENVY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/46_THE_INFLUENCER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/79_THE_INFLUENCER_DIET.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/67_THE_FITNESS_INFLUENCER.png'
  ],   91: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/9_THE_INFORMATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/32__THERE_S_SOMEONE_FOR_EVERYONE_.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/16_THE_BUILDING_TOGETHER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_positive_vol4/23_THE_COOKING_FOR_OTHERS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_real_thing_vol7/6_THE_BLOCK_WHERE_EVERYONE_KNOWS_YOU.png'
  ],   92: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/19_THE_PERSONAL_AI_ASSISTANT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/10_THE_PERSONALIZED_LEARNING_AI.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/69_THE_RESOURCE_SHARING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/6_THE_DOMINANCE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/43_THE_WILLPOWER.png'
  ],   93: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/1_THE_HIERARCHY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/31_THE_INFINITE_HIERARCHY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/15_THE_HIERARCHY_READING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/2_THE_KITCHEN_FULL_OF_PEOPLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_vol3/11_THE_LEAVING_PARTY_EARLY.png'
  ],   94: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/91_THE_DEATH_AWARENESS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/96_THE_FACE_DEATH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/76_THE_HIDDEN_DEATH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/91_THE_REAL_TRIBE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/84_THE_BRAND_TRIBE.png'
  ],   95: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/17_THE_PEOPLE_DREAD.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/11_THE_DUNBAR_ENFORCEMENT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/38_THE_VILLAGE_SCALE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/98_THE_WALK_WITHOUT_DESTINATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/2_THE_KITCHEN_FULL_OF_PEOPLE.png'
  ],   96: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_scale_matters/19_THE_BUILDING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/hoffman_interface_theory_series/41_THE_CONSCIOUSNESS_ICON.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/74_THE_ENVIRONMENT_DESIGN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/16_THE_BUILDING_TOGETHER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/89_THE_RETURNING.png'
  ],   97: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/111_THE_LANGUAGE_BROKEN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/87_THE_PURPOSELESS_DRIFT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_everyone_wrong_vol11%20%281%29/96_THE_BROKEN_HOME.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/8_THE_CREATIVITY_AUGMENTATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/13_THE_LOCAL_FIRST.png'
  ],   98: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/52_THE_COMMUNICATION_ENHANCEMENT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/30_THE_PARASOCIAL_RELATIONSHIP.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/5_THE_ATTENTION_ENHANCEMENT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/111_THE_LANGUAGE_BROKEN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_everyone_wrong_vol11%20%281%29/96_THE_BROKEN_HOME.png'
  ],   99: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/73_THE_FOOD_PRESERVED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_positive_vol4/64_THE_CREATING_SOMETHING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/84_THE_FOOD_PRESERVED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/81_THE_CLIENT_SERVED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/8_THE_PRESERVED_HARVEST.png'
  ],   100: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/83_THE_ONLINE_PERSONA.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/40_THE_CIRCADIAN_OPTIMIZATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/11_THE_SLEEP_OPTIMIZATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/41_THE_MOVEMENT_REQUIRED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_vol3/32_THE_SLEEP_PERSONALITY.png'
  ],   101: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/91_THE_REAL_TRIBE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/84_THE_BRAND_TRIBE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/22_THE_TRIBE_THAT_ISN_T.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/35__FIND_YOUR_TRIBE_ONLINE_.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dystopia_100_prompts/5_THE_TRIBE_SIMULATED.png'
  ],   102: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/5_THE_INFINITE_SCROLL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/32_THE_DOOMSCROLL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/21_THE_CROWD_OF_STRANGERS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/basics_of_the_mismatched_human/the_doomscroll.jpeg',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/35__FIND_YOUR_TRIBE_ONLINE_.png'
  ],   103: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/70_THE_ENGAGEMENT_BAIT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/30_THE_METRICS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/43_THE_STUDENT_SUCCEEDING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_positive_vol4/94_THE_GROWTH_RECOGNITION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_everyone_wrong_vol11%20%281%29/75_THE_GROWTH_MINDSET_CURE.png'
  ],   104: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/5_THE_ATTENTION_ENHANCEMENT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/78_THE_DREAM_ENHANCEMENT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/34_THE_VISION_ENHANCEMENT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/47_THE_RESPIRATORY_ENHANCEMENT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/52_THE_COMMUNICATION_ENHANCEMENT.png'
  ],   105: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/70_THE_GROUP_TEXT_ANXIETY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/3_THE_FRIEND_GROUP_ENVY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/91_THE_FAMILY_GROUP_CHAT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/6_THE_BUY_NOTHING_GROUP.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/16_THE_SMALL_GROUP.png'
  ],   106: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/68_THE_ANXIETY_MEDICATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/58_THE_MEDICATION_SHAME.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/63_THE_GRIEF_SUPPORT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/15_THE_DECISION_SUPPORT_AI.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/6_THE_SOCIAL_PREDICTION_AI.png'
  ],   107: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/17_THE_NUCLEAR.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/34_THE_LIMITED_TIME.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/60_THE_CHRONIC.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/39_THE_MENTOR_MATCHED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/8_THE_INTEREST_MATCHED.png'
  ],   108: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/68_THE_ANXIETY_MEDICATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/2_THE_COLIVING_MATCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/69_THE_NATURE_BELONGING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/67_THE_NATURE_IMMERSION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/58_THE_MEDICATION_SHAME.png'
  ],   109: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/68_THE_COLLECTIVE_GOVERNANCE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/95_THE_GOODBYE_PROPER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_50_status_game_vol9/49_THE_IMPOSSIBLE_DREAM.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/70_THE_SABBATH_PRACTICE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/59_THE_EYE_CONTACT_HELD.png'
  ],   110: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/21_THE_VISIBLE_CONTRIBUTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/21_THE_CONTRIBUTION_VISIBLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/26_THE_WORK_VISIBLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/24_THE_INVISIBLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/59_THE_INVISIBLE_CHAINS.png'
  ],   111: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/68_THE_ANXIETY_MEDICATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/5_THE_STATUS_ANXIETY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/72_THE_STATUS_ANXIETY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/70_THE_GROUP_TEXT_ANXIETY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/20_THE_SOCIAL_ANXIETY.png'
  ],   112: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/20_THE_PARASOCIAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/30_THE_PARASOCIAL_BOND.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/30_THE_PARASOCIAL_RELATIONSHIP.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/58_THE_PARASOCIAL_BLOCK.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/82_THE_PARASOCIAL_BOND.png'
  ],   113: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/86_THE_ACCEPTANCE_DEEPENING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/58_THE_MEETING_EXHAUSTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/94_THE_PEOPLE_PLEASING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_scale_matters/30_THE_INVESTMENT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/36_THE_MEETING_ABOUT_MEETINGS.png'
  ],   114: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/50_THE_COHOUSING_FOUND.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_real_thing_vol7/44_THE_COHOUSING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_scale_matters/19_THE_BUILDING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/98_THE_WALK_WITHOUT_DESTINATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/10_THE_MORNING_WITHOUT_BREAKFAST.png'
  ],   115: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/32_THE_MEANINGFUL_PROJECT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/21_THE_VISIBLE_CONTRIBUTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/21_THE_CONTRIBUTION_VISIBLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/70_THE_COLLECTIVE_PROJECTS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/22_THE_CONTRIBUTION.png'
  ],   116: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/1_THE_MORNING_LIGHT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/45_THE_DAILY_PRACTICE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_positive_vol4/22_THE_SHARED_MEAL_WARMTH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/70_THE_MOVEMENT_DEBT.png'
  ],   117: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/21_THE_CROWD_OF_STRANGERS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/91_THE_REAL_TRIBE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/84_THE_BRAND_TRIBE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/22_THE_TRIBE_THAT_ISN_T.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/35__FIND_YOUR_TRIBE_ONLINE_.png'
  ],   118: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/71_THE_SELLING_TIME.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/70_THE_SABBATH_PRACTICE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/59_THE_EYE_CONTACT_HELD.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/74_THE_BELONGING_SIGNALS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/67_THE_MUTUAL_AID_COORDINATION.png'
  ],   119: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_everyone_wrong_vol11%20%281%29/20_THE_TEN_THOUSAND_HOURS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_scale_matters/19_THE_BUILDING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/16_THE_BUILDING_TOGETHER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_positive_vol4/65_THE_SHOWING_SOMEONE_SOMETHING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_positive_vol4/93_THE_SURVIVING_SOMETHING.png'
  ],   120: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/48_THE_MORAL_FAILURE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/73_THE_BREASTFEEDING_FAILURE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/12_THE_GYM_FAILURE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/107_THE_FAILURE_SURVIVED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100/94_THE_GRATITUDE_FAILURE.png'
  ],   121: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/7_THE_FIRST_CLASS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/100_THE_FIRST_STEP.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/basics_of_the_mismatched_human/the_first_impression.jpeg',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/55_THE_FIRST_KILL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/13_THE_LOCAL_FIRST.png'
  ],   122: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/91_THE_REAL_TRIBE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/84_THE_BRAND_TRIBE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/22_THE_TRIBE_THAT_ISN_T.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/35__FIND_YOUR_TRIBE_ONLINE_.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dystopia_100_prompts/5_THE_TRIBE_SIMULATED.png'
  ],   123: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/94_THE_PEOPLE_PLEASING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/1_THE_UNDERSTANDING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/2_THE_KITCHEN_FULL_OF_PEOPLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/17_THE_PEOPLE_DREAD.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/8_THE_PEOPLE_WHO_MATTER.png'
  ],   124: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/32_THE_MEANINGFUL_PROJECT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/6_THE_MEANINGFUL_GOAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/11_THE_CHILDREN_S_BIRTHDAY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/53_THE_MEANINGLESS_JOB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/87_THE_CHILDREN.png'
  ],   125: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/98_THE_SCARCITY_MINDSET.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_everyone_wrong_vol11%20%281%29/13_THE_SUFFERING_VIRTUE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/16_THE_EFFORT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/60_THE_TOXIC_POSITIVITY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/basics_of_the_mismatched_human/the_sleep_deprivation.jpeg'
  ],   126: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/53_THE_MEANINGLESS_JOB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/32_THE_MEANINGFUL_PROJECT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/45_THE_PURPOSE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/90_THE_PURPOSE_CLARIFICATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/95_THE_MEANING_PERCEPTION.png'
  ],   127: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/32_THE_MEANINGFUL_PROJECT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/53_THE_MEANINGLESS_JOB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/52_THE_PLAY_WITH_NO_PURPOSE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/6_THE_MEANINGFUL_GOAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/25_THE_SYNTHETIC_MEANING.png'
  ],   128: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/53_THE_REPUTATION_SYSTEM.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/2_THE_STATUS_SCAN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/97_THE_LOCAL_STATUS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/29_THE_REPUTATION_REALITY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/38_THE_REPUTATION_EARNED.png'
  ],   129: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/32_THE_METABOLISM_CONTROL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/53_THE_REPUTATION_SYSTEM.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/36_THE_FERTILITY_CONTROL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/9_THE_DIRECT_SALE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/29_THE_PRODUCTIVITY_SYSTEM.png'
  ],   130: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/55_THE_DRIVE-THROUGH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/52_THE_SOCIAL_TOUCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_demismatch_tech_vol6/92_THE_RUNNING_APP_SOCIAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dating_mating_100_prompts_final2/60_THE_ROOMMATES.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_real_thing_vol7/42_THE_ROOMMATES_WHO_BECAME_FAMILY.png'
  ],   131: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/40_THE_RETURN_GATHERING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/38_THE_SCHOOL_DEBT_RETURN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/26_THE_RETURN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/89_THE_RETURNING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_positive_vol4/79_THE_CEREMONY_FEELING.png'
  ],   132: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100/23_THE_MONEY_TALK_AVOIDANCE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/39_THE_SMALL_GAME.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/30_THE_SMALL_TALK.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/30_THE_PERFECTIONISM.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/35_THE_MONEY_ABSTRACTION.png'
  ],   133: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/31_THE_INFINITE_HIERARCHY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/93_THE_INFINITE_BROWSE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/98_THE_INFINITE_CHOICE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/5_THE_INFINITE_SCROLL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dystopia_100_prompts/6_THE_INFINITE_NETWORK.png'
  ],   134: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/91_THE_LANGUAGE_SHARED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/9_THE_SHARED_PLATE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/58_THE_SHARED_GRIEF.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_real_thing_vol7/56_THE_SHARED_HOUSE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/43_THE_SHARED_BURDEN.png'
  ],   135: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/21_THE_CROWD_OF_STRANGERS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/14_THE_STRANGER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/87_THE_NEIGHBORHOOD_STRANGER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/15_THE_STRANGER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/11_THE_STRANGER_DANGER.png'
  ],   136: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/30_THE_PARASOCIAL_RELATIONSHIP.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/23__STAY_CONNECTED_.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/51_THE_NUMBER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/94_THE_PEOPLE_PLEASING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_trap_recognized/80_THE_RELATIONSHIP_AS_CONTENT.png'
  ],   137: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/17_THE_BRAIN-COMPUTER_INTERFACE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/20_THE_KITCHEN_GARDEN_DESIGNED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/49_THE_MULTIGENERATIONAL_DESIGNED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/hoffman_interface_theory_series/13_THE_COST_OF_TRUTH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/92_THE_TRUTH_SPOKEN.png'
  ],   138: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/86_THE_FITNESS_INFLUENCER_COMPARISON.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/29_THE_REPUTATION_REALITY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/67_THE_FITNESS_INFLUENCER.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/16_THE_VIRTUAL_REALITY_IMMERSION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/13_THE_FITNESS_AUGMENTATION.png'
  ],   139: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/21_THE_CROWD_OF_STRANGERS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_overload_series/27_THE_ARGUMENT_WITH_STRANGERS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/basics_of_the_mismatched_human/the_suspicion_of_strangers_a93bfb.jpeg',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/basics_of_the_mismatched_human/the_suspicion_of_strangers.jpeg',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/hoffman_interface_theory_series/27_THE_FEAR_CATEGORIES.png'
  ],  140: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png'
  ],   141: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/4_THE_FUNCTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/49_THE_ERECTILE_DYSFUNCTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/32_THE_FUNCTIONAL_DOCTOR.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/37_THE_PROCESSING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/72_THE_FUNCTIONING_COLLAPSE.png'
  ],   142: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/20__IT_S_DIFFERENT_FOR_YOU_.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/46_THE_STATUS_DIFFERENTIAL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/38_THE_ANXIETY_DIAGNOSIS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/66_THE_CHECKLIST_DIAGNOSIS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_psychiatry_vol10/51_THE_DIAGNOSIS_SHOPPING.png'
  ],   143: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/73_THE_FOOD_PRESERVED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_positive_vol4/64_THE_CREATING_SOMETHING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/84_THE_FOOD_PRESERVED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/20_THE_KITCHEN_GARDEN_DESIGNED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_same_scene_two_eyes/33_THE_NURSERY_DESIGN.png'
  ],   144: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/32_THE_THERAPY_TREADMILL.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/77_THE_PSYCHEDELIC_THERAPY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/meaning_purpose_sacred_100_prompts_v2/88_THE_THERAPY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/31_THE_RETAIL_THERAPY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/61_THE_THERAPY_SHOPPING.png'
  ],   145: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/90_THE_CAREER_CHANGE_FEAR.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/17_THE_PEOPLE_DREAD.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_everyone_wrong_vol11%20%281%29/13_THE_SUFFERING_VIRTUE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/94_THE_PEOPLE_PLEASING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/25__TRAVEL_WILL_CHANGE_YOU_.png'
  ],   146: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_everyone_wrong_vol11%20%281%29/13_THE_SUFFERING_VIRTUE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/70_THE_MESH_NETWORKED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/38__TREAT_YOURSELF_.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_lies_we_tell/50__YOU_JUST_NEED_TO_LOVE_YOURSELF_.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/36_THE_PROBLEM_SOLVED.png'
  ],   147: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/83_THE_STEP-PARENT_STRUGGLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/53_THE_PARENT_WATCHING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/55_THE_SHARED_STRUGGLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_esteem_dynamics_vol8/48_THE_COALITION_BUILDING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/60_THE_CONSTANT_TIREDNESS.png'
  ],   148: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/1_THE_UNDERSTANDING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dashboard_calibrated_series/21_THE_VISIBLE_CONTRIBUTION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/21_THE_CONTRIBUTION_VISIBLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/utopia_100_prompts/26_THE_WORK_VISIBLE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/dating_mating_100_prompts_final2/39_THE_INVISIBLE_MAN.png'
  ],   149: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/31_THE_BLISS_POINT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/85_THE_SET_POINT_DEFENSE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/food_body_appetite_100_prompts/22_THE_SET_POINT.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_everyone_wrong_vol11%20%281%29/13_THE_SUFFERING_VIRTUE.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/hoffman_interface_theory_series/13_THE_COST_OF_TRUTH.png'
  ],   150: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_bridge_series/52_THE_TOOL_LIBRARY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_demismatch_tech_vol6/63_THE_TOOL_LIBRARY.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100/68_THE_ANXIETY_MEDICATION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100/33_THE_CROWDED_LONELINESS.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/5_THE_STATUS_ANXIETY.png'
  ],   151: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/36_THE_PROBLEM_SOLVED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_vol3/4_THE_FINISHING_PROBLEM.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/10_THE_ANGER_PROBLEM.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_answer_100_positive_vol4/26_THE_PROBLEM_SOLVED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/39_THE_PROBLEM_SOLVING_TOGETHER.png'
  ],  152: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/17_THE_PEOPLE_DREAD.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/17_THE_PEOPLE_DREAD.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/17_THE_PEOPLE_DREAD.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/17_THE_PEOPLE_DREAD.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_vol2/17_THE_PEOPLE_DREAD.png'
  ],  153: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png'
  ],  154: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/5_THE_BAOBAB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/5_THE_BAOBAB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/5_THE_BAOBAB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/5_THE_BAOBAB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/5_THE_BAOBAB.png'
  ],  155: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/11_THE_COALITION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/11_THE_COALITION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/11_THE_COALITION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/11_THE_COALITION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/social_dynamics_100_prompts%20%281%29/11_THE_COALITION.png'
  ],  156: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png'
  ],  157: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/5_THE_BAOBAB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/5_THE_BAOBAB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/5_THE_BAOBAB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/5_THE_BAOBAB.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/eea_100_v2/5_THE_BAOBAB.png'
  ],  158: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/emotions_100_prompts/10_THE_MISMATCH.png'
  ],  159: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/67_THE_NATURE_IMMERSION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/67_THE_NATURE_IMMERSION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/67_THE_NATURE_IMMERSION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/67_THE_NATURE_IMMERSION.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/67_THE_NATURE_IMMERSION.png'
  ],   160: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/111_THE_LANGUAGE_BROKEN.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/83_THE_THING_SHIPPED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/17_THE_WATER_SWIMMING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_series/74_THE_DOING_NOTHING.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/7_THE_DOING_NOTHING_TOGETHER.png'
  ],   161: [
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_mismatch_actually_100_matched_vol5/100_THE_CIRCLE_CLOSED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/money_consumption_status_100_prompts/63_THE_CLOSET.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/fear_anxiety_100_prompts/95_THE_ENCLOSED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_real_thing_part2%20%281%29/116_THE_DOOR_CLOSED.png',
    'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/mismatch-images/the_sequencing/19_THE_PERSONAL_AI_ASSISTANT.png'
  ],
};



const tileData: TileData[] = [
  {
    id: 1,
    question: "Why do you feel so bad?",
    answer: `You're not broken. Your environment is.

This is [mismatch](/glossary#mismatch)—the gap between what your biology expects and what it gets. Your brain was built for a world that no longer exists.`,
    imageUrls: imageMap[1]
  },
  {
    id: 2,
    question: "Why does modern life feel so wrong?",
    answer: `You evolved for completely different conditions.

For 300,000 years, humans lived in the [EEA](/glossary#eea)—small bands, known faces, daily closure. Then everything changed faster than evolution could track.`,
    imageUrls: imageMap[2]
  },
  {
    id: 3,
    question: "Why can't you stop thinking about things you can't control?",
    answer: `You're caught in an [open loop](/glossary#open-loop).

Your brain evolved to solve problems and move on. Climate change? The economy? No action resolves them. The loop won't close.`,
    imageUrls: imageMap[3]
  },
  {
    id: 4,
    question: "What would it feel like to actually finish something?",
    answer: `That's a [closed loop](/glossary#closed-loop). Problem resolved. Emotion dissipates.

Hunt → eat → done. This is what your brain was designed for. Not infinite unresolvable anxiety.`,
    imageUrls: imageMap[4]
  },
  {
    id: 5,
    question: "Why do you care what strangers think?",
    answer: `Because social rejection used to be death.

High [status](/glossary#status) meant survival. The drive isn't vanity—it's [indirect fitness](/glossary#indirect-fitness). Still running.`,
    imageUrls: imageMap[5]
  },
  {
    id: 6,
    question: "Is there a limit to how many people you can actually know?",
    answer: `Yes. Hard limit. [Dunbar's numbers](/glossary#dunbars-numbers):

[5](/glossary#the-5) intimate, [15](/glossary#the-15) close, [50](/glossary#the-50-band) friends, [150](/glossary#the-150-tribe) meaningful. Beyond that, people become categories.`,
    imageUrls: imageMap[6]
  },
  {
    id: 7,
    question: "You have 2,000 followers. Why are you lonely?",
    answer: `Followers aren't tribe.

Those 2,000 create [parasocial relationships](/glossary#parasocial-relationships)—one-way bonds with people who don't know you exist. Your [Dunbar layers](/glossary#dunbars-numbers) are full of strangers.`,
    imageUrls: imageMap[7]
  },
  {
    id: 8,
    question: "Why do substitutes never satisfy you?",
    answer: `They're designed not to.

A [proxy](/glossary#proxy) hijacks a drive without meeting the need. Social media for belonging. Porn for intimacy. Momentary relief, increasing hunger.`,
    imageUrls: imageMap[8]
  },
  {
    id: 9,
    question: "Why do quick fixes make things worse?",
    answer: `[Proxies](/glossary#proxy) address signals, not needs. They create tolerance. They prevent real solutions.

The business model requires they don't work.`,
    imageUrls: imageMap[9]
  },
  {
    id: 10,
    question: "Why does getting what you want leave you wanting more?",
    answer: `You got what you *thought* you wanted.

Wants: fame, money, perfect life. Needs: small [tribe](/glossary#the-150-tribe), real connection. Chasing [proxies](/glossary#proxy) while needs go unmet.`,
    imageUrls: imageMap[10]
  },
  {
    id: 11,
    question: "What are your emotions actually telling you?",
    answer: `They're data. [Signal or symptom](/glossary#signal-vs-symptom)?

Signal: something needs addressing. Symptom: broken machinery. Most suffering is signal. The environment is wrong.`,
    imageUrls: imageMap[11]
  },
  {
    id: 12,
    question: "So your feelings aren't the problem?",
    answer: `Correct. The environment generating them is.

Your anxiety isn't broken. Your environment is actually threatening. The [signal](/glossary#signal-vs-symptom) is accurate.`,
    imageUrls: imageMap[12]
  },
  {
    id: 13,
    question: "Are your symptoms trying to tell you something?",
    answer: `[Signal vs. symptom](/glossary#signal-vs-symptom) is the core distinction.

Psychiatry treats signals as symptoms. Suppresses accurate feedback. Different diagnosis, different treatment.`,
    imageUrls: imageMap[13]
  },
  {
    id: 14,
    question: "What's wrong with just treating symptoms?",
    answer: `Covering the oil light instead of checking the engine.

The [oil light metaphor](/glossary#oil-light-metaphor): medication suppresses the [signal](/glossary#signal-vs-symptom). The engine keeps degrading.`,
    imageUrls: imageMap[14]
  },
  {
    id: 15,
    question: "What is anxiety actually?",
    answer: `Accurate threat detection.

[Open loops](/glossary#open-loop) everywhere. Strangers everywhere. The alarm is working. The environment is actually dangerous.`,
    imageUrls: imageMap[15]
  },
  {
    id: 16,
    question: "What is depression actually?",
    answer: `Accurate meaning assessment.

No [tribe](/glossary#the-150-tribe). No [visible purpose](/glossary#visible-contribution). [Loops](/glossary#open-loop) that never close. The [signal](/glossary#signal-vs-symptom) is correct.`,
    imageUrls: imageMap[16]
  },
  {
    id: 17,
    question: "Is something wrong with you, or with your environment?",
    answer: `The environment.

A [fish on land](/glossary#fish-on-land) flops. Its gills work perfectly—designed for water. You wouldn't medicate the flopping. You'd put it back.`,
    imageUrls: imageMap[17]
  },
  {
    id: 18,
    question: "Why do doctors diagnose the flopping?",
    answer: `They've normalized the land.

[Flopping disorder](/glossary#flopping-disorder): pathologizing adaptive responses to [mismatch](/glossary#mismatch). No billing code for "wrong environment."`,
    imageUrls: imageMap[18]
  },
  {
    id: 19,
    question: "What does being in the wrong environment do to you?",
    answer: `Everything breaks.

Sleep without light cycles. Belonging without [tribe](/glossary#the-150-tribe). Meaning without [visible contribution](/glossary#visible-contribution). The [fish](/glossary#fish-on-land) isn't uncomfortable—it's dying.`,
    imageUrls: imageMap[19]
  },
  {
    id: 20,
    question: "What environment did humans actually evolve for?",
    answer: `The [EEA](/glossary#eea). Small bands of 30-50. [Tribe](/glossary#the-150-tribe) of 150. Known faces. [Fire circles](/glossary#fire-circle) every night. [Shared parenting](/glossary#alloparenting).

This is the spec sheet. We're running on something else.`,
    imageUrls: imageMap[20]
  },
  {
    id: 21,
    question: "Why can't you stop ruminating?",
    answer: `[Rumination](/glossary#rumination) is planning without anything to plan.

It evolved to solve problems. Now it runs on unsolvable ones. The machinery churns without producing output.`,
    imageUrls: imageMap[21]
  },
  {
    id: 22,
    question: "Why do you imagine people judging you?",
    answer: `The [internal audience](/glossary#internal-audience). Imaginary critics generating real anxiety.

Your brain evolved being watched by 150. Now it simulates an audience. Harsher than any real one.`,
    imageUrls: imageMap[22]
  },
  {
    id: 23,
    question: "Why do you always assume the worst?",
    answer: `[Negativity bias](/glossary#negativity-bias). Missing a threat was fatal. Missing an opportunity was recoverable.

Now it runs on phantoms. Calibrated for real dangers that aren't there.`,
    imageUrls: imageMap[23]
  },
  {
    id: 24,
    question: "Why can you never be good enough?",
    answer: `The [perfectionism trap](/glossary#perfectionism-trap). Your [internal audience](/glossary#internal-audience) holds contradictory standards.

Be confident but not arrogant. Successful but not obsessed. Any position violates something.`,
    imageUrls: imageMap[24]
  },
  {
    id: 25,
    question: "Why is almost-having-control worse than no control?",
    answer: `[Partial control](/glossary#partial-control)—the worst anxiety zone.

You can affect outcomes, so you can't let go. You can't determine them, so you can't resolve it. [Loop](/glossary#open-loop) stays open.`,
    imageUrls: imageMap[25]
  },
  {
    id: 26,
    question: "How many close friends do you actually need?",
    answer: `[Five](/glossary#the-5). People you'd call at 3am. Complete vulnerability.

If that circle has fewer than 5, that's the problem. Most modern people have 0-2.`,
    imageUrls: imageMap[26]
  },
  {
    id: 27,
    question: "How many people can you genuinely care about?",
    answer: `About [15](/glossary#the-15). People whose deaths would devastate you.

Active care, not passive connection. Count people you've had meaningful contact with this month.`,
    imageUrls: imageMap[27]
  },
  {
    id: 28,
    question: "Why do you feel like you're failing even when you're \"successful\"?",
    answer: `You got cultural success, not biological success.

Money and credentials, but no [tribe](/glossary#the-150-tribe), no [visible contribution](/glossary#visible-contribution), no [closed loops](/glossary#closed-loop). The [signal](/glossary#signal-vs-symptom) is accurate.`,
    imageUrls: imageMap[28]
  },
  {
    id: 29,
    question: "Why does modern work feel meaningless?",
    answer: `[Immediate-return](/glossary#immediate-return-economy) vs. delayed-return.

Ancestral work: hunt → eat. Modern work: 8 hours of abstraction for invisible shareholders. Your meaning-making systems can't connect effort to survival.`,
    imageUrls: imageMap[29]
  },
  {
    id: 30,
    question: "What are bullshit jobs?",
    answer: `Work that produces nothing tangible, benefits no one you know, exists to perpetuate itself.

[Visible contribution](/glossary#visible-contribution) is a human need. [Bullshit jobs](/glossary#bullshit-jobs) structurally deny it.`,
    imageUrls: imageMap[30]
  },
  {
    id: 31,
    question: "Why are you exhausted by crowds and cities?",
    answer: `[Stranger overload](/glossary#stranger-overload).

You encounter more unknown humans daily than ancestors met in years. Your brain can't stop assessing them.`,
    imageUrls: imageMap[31]
  },
  {
    id: 32,
    question: "How many strangers did ancestors encounter?",
    answer: `Maybe 1,000 in a lifetime.

Daily life was exclusively known faces. Now you encounter thousands daily. The [mismatch](/glossary#mismatch) is total.`,
    imageUrls: imageMap[32]
  },
  {
    id: 33,
    question: "Why are you comparing yourself to millions of people?",
    answer: `[Status](/glossary#status) competition [mismatch](/glossary#mismatch).

You evolved to compete among 150. Now you're compared against 8 billion. Excellence that was exceptional locally is ordinary globally.`,
    imageUrls: imageMap[33]
  },
  {
    id: 34,
    question: "Why do you care so much about status?",
    answer: `High [status](/glossary#status) meant survival. More resources, allies, mates, protection.

The drive is [indirect fitness](/glossary#indirect-fitness). The problem is the comparison pool exploded.`,
    imageUrls: imageMap[34]
  },
  {
    id: 35,
    question: "Why do fake things feel better than real things?",
    answer: `[Hyperstimuli](/glossary#hyperstimuli)—stimuli exceeding anything in nature.

Porn, junk food, social media. They hijack drives by exaggerating what drives respond to. Real satisfactions become inadequate.`,
    imageUrls: imageMap[35]
  },
  {
    id: 36,
    question: "Why do you feel connected to people who don't know you exist?",
    answer: `[Parasocial relationships](/glossary#parasocial-relationships). One-way bonds.

You know their face, voice, struggles. They've never heard your name. Every celebrity you track takes bandwidth from real relationships.`,
    imageUrls: imageMap[36]
  },
  {
    id: 37,
    question: "Why is your suffering profitable?",
    answer: `A satisfied human is a terrible customer.

The [atomized individual](/glossary#atomized-individual)—severed from [tribe](/glossary#the-150-tribe), purpose, intimacy—is the ideal consumer. Your [mismatch](/glossary#mismatch) is the business model.`,
    imageUrls: imageMap[37]
  },
  {
    id: 38,
    question: "How do companies make money from your unhappiness?",
    answer: `The [exploitation formula](/glossary#exploitation-formula):

Identify need → block satisfaction → offer [proxy](/glossary#proxy) → proxy doesn't satisfy → monetize return visits.`,
    imageUrls: imageMap[38]
  },
  {
    id: 39,
    question: "Why does being alone make you easier to manipulate?",
    answer: `The [atomized individual](/glossary#atomized-individual) has no counter-narrative.

No community to say "you don't need that." No [tribe](/glossary#the-150-tribe) meeting needs for real. You're vulnerable because no one's watching out.`,
    imageUrls: imageMap[39]
  },
  {
    id: 40,
    question: "Why are slot machines and social media so addictive?",
    answer: `[Variable ratio reinforcement](/glossary#variable-ratio-reinforcement)—the most addictive reward schedule.

Unpredictable rewards for consistent behavior. Pull-to-refresh is literally a slot machine lever.`,
    imageUrls: imageMap[40]
  },
  {
    id: 41,
    question: "What is dopamine and how is it hijacked?",
    answer: `[Dopamine](/glossary#dopamine) drives reward-seeking. It spikes on anticipation, not receipt.

Modern tech delivers triggers without effort or satisfaction. Chronic activation. Tolerance. Real satisfactions become inadequate.`,
    imageUrls: imageMap[41]
  },
  {
    id: 42,
    question: "How does social media exploit you?",
    answer: `Profits from loneliness.

[Variable ratio reinforcement](/glossary#variable-ratio-reinforcement) keeps you scrolling. [Parasocial bonds](/glossary#parasocial-relationships) fill your [Dunbar layers](/glossary#dunbars-numbers) with strangers. You're the product.`,
    imageUrls: imageMap[42]
  },
  {
    id: 43,
    question: "Is depression really a chemical imbalance?",
    answer: `The [serotonin hypothesis](/glossary#serotonin-hypothesis) has been debunked.

2022 review: no consistent evidence. The narrative was marketing, not science. SSRIs are [signal override](/glossary#signal-override), not repair.`,
    imageUrls: imageMap[43]
  },
  {
    id: 44,
    question: "What does psychiatric medication actually do?",
    answer: `[Signal override](/glossary#signal-override). Floods systems to suppress [signals](/glossary#signal-vs-symptom) without addressing what they're responding to.

Sometimes necessary. As the whole intervention? [Oil light](/glossary#oil-light-metaphor) covered, engine degrading.`,
    imageUrls: imageMap[44]
  },
  {
    id: 45,
    question: "How does pharma exploit you?",
    answer: `Invented "chemical imbalance" to sell chemicals.

[Ghostwritten studies](/glossary#ghostwritten-studies). Paid experts. 15-minute checks. Environment never discussed.`,
    imageUrls: imageMap[45]
  },
  {
    id: 46,
    question: "What are ghostwritten studies?",
    answer: `Research papers written by pharma, published under academic names.

Documented in litigation. The "scientific literature" is substantially marketing material.`,
    imageUrls: imageMap[46]
  },
  {
    id: 47,
    question: "Why is chronic stress destroying your body?",
    answer: `[Cortisol](/glossary#cortisol)—designed to spike briefly, then dissipate.

Tiger appears, cortisol mobilizes. Tiger leaves, cortisol drops. Modern life: the tiger never leaves.`,
    imageUrls: imageMap[47]
  },
  {
    id: 48,
    question: "How does news media exploit you?",
    answer: `Profits from threat activation.

[Open loops](/glossary#open-loop) that never close. [Cortisol](/glossary#cortisol) elevated for engagement. The business model keeps you worried about things you can't fix.`,
    imageUrls: imageMap[48]
  },
  {
    id: 49,
    question: "How does the food industry exploit you?",
    answer: `Engineers the [bliss point](/glossary#bliss-point)—sugar, fat, salt for maximum craving without satisfaction.

Designed to be impossible to eat in moderation. Addiction is the feature.`,
    imageUrls: imageMap[49]
  },
  {
    id: 50,
    question: "How do dating apps exploit you?",
    answer: `Business model requires failure.

Successful match = lost user. [Variable ratio reinforcement](/glossary#variable-ratio-reinforcement) keeps you swiping. Designed for engagement, not outcomes.`,
    imageUrls: imageMap[50]
  },
  {
    id: 51,
    question: "How does porn exploit you?",
    answer: `[Hyperstimuli](/glossary#hyperstimuli) hijacking mating drive.

Unlimited novelty. [Dopamine](/glossary#dopamine) overwhelmed. Real partners become inadequate. The [proxy](/glossary#proxy) destroys capacity for the real thing.`,
    imageUrls: imageMap[51]
  },
  {
    id: 52,
    question: "How does self-help exploit you?",
    answer: `Requires that self-help doesn't work.

Individual solutions to systemic problems. If you were actually helped, you wouldn't buy the next book.`,
    imageUrls: imageMap[52]
  },
  {
    id: 53,
    question: "Why are you obsessed with celebrities?",
    answer: `Fame is [hyperstimulus](/glossary#hyperstimuli) for status recognition.

You form [parasocial bonds](/glossary#parasocial-relationships). They extract investment without reciprocity. Feels like connection. Actually displacement.`,
    imageUrls: imageMap[53]
  },
  {
    id: 54,
    question: "Why do sports fans act like it actually matters?",
    answer: `Tribal belonging through [proxy](/glossary#proxy).

Your team vs. their team. Shared goals, common enemies. Almost meets the need for [tribe](/glossary#the-150-tribe). Almost.`,
    imageUrls: imageMap[54]
  },
  {
    id: 55,
    question: "Why isn't this common knowledge?",
    answer: `Incentives. Not conspiracy—just money.

Funding goes to drugs, not environmental intervention. [Ghostwritten studies](/glossary#ghostwritten-studies) shape literature. Truth isn't profitable.`,
    imageUrls: imageMap[55]
  },
  {
    id: 56,
    question: "Who are the most exploited customers?",
    answer: `[Whales](/glossary#whales). Gambling term for vulnerable users who account for disproportionate revenue.

Problem gamblers. Addictive tendencies. Your vulnerability is their profit center.`,
    imageUrls: imageMap[56]
  },
  {
    id: 57,
    question: "How does advertising exploit you?",
    answer: `$700B+ annually weaponizing evolutionary psychology.

Manufacturing inadequacy. Making you feel bad so you'll buy products to feel better. The inadequacy is created, not discovered.`,
    imageUrls: imageMap[57]
  },
  {
    id: 58,
    question: "How does gambling exploit you?",
    answer: `[Variable ratio reinforcement](/glossary#variable-ratio-reinforcement) perfected, then exported everywhere.

Loot boxes. Gacha games. Engagement loops. [Whales](/glossary#whales) specifically targeted.`,
    imageUrls: imageMap[58]
  },
  {
    id: 59,
    question: "Do rats get addicted because of drugs, or because of loneliness?",
    answer: `Loneliness. [Rat Park](/glossary#rat-park).

Isolated rats self-administer to death. Rats in enriched environments largely ignore drugs. The variable is environment, not substance.`,
    imageUrls: imageMap[59]
  },
  {
    id: 60,
    question: "What is addiction actually?",
    answer: `Drive-seeking redirected to [proxies](/glossary#proxy).

Real satisfactions blocked, so you reach for substitutes. [Rat Park](/glossary#rat-park) showed this: matched environments don't self-medicate.`,
    imageUrls: imageMap[60]
  },
  {
    id: 61,
    question: "What is ADHD actually?",
    answer: `Hunter cognition in a farmer world.

Scanning attention. Movement-seeking. Novelty-responsive. Adaptive in the [EEA](/glossary#eea). Then we built classrooms requiring stillness and called deviation disorder.`,
    imageUrls: imageMap[61]
  },
  {
    id: 62,
    question: "Why is \"normal\" defined so narrowly?",
    answer: `[Farmer brain](/glossary#farmer-brain) became the standard.

One cognitive style—suited for agriculture and factories—became "well-adjusted." Everything else became pathology.`,
    imageUrls: imageMap[62]
  },
  {
    id: 63,
    question: "What is social anxiety actually?",
    answer: `Fear of the [internal audience](/glossary#internal-audience) projected onto real people.

You assume strangers scrutinize with the intensity of your internal critics. They don't. They barely know you exist.`,
    imageUrls: imageMap[63]
  },
  {
    id: 64,
    question: "What is burnout?",
    answer: `Work/purpose [mismatch](/glossary#mismatch).

8-12 hours of effort with no [visible contribution](/glossary#visible-contribution). No [closed loops](/glossary#closed-loop). Your brain knows the work is actually meaningless.`,
    imageUrls: imageMap[64]
  },
  {
    id: 65,
    question: "What is imposter syndrome?",
    answer: `Often: accurate recognition that your work doesn't visibly benefit anyone you know.

Credentials without [visible contribution](/glossary#visible-contribution). The "syndrome" might be [signal](/glossary#signal-vs-symptom).`,
    imageUrls: imageMap[65]
  },
  {
    id: 66,
    question: "Are psychiatric conditions real diseases?",
    answer: `No biomarkers. No blood tests. Behavioral descriptions, not disease entities.

The conditions are real. The suffering is real. Calling them diseases like cancer or diabetes? Category error.`,
    imageUrls: imageMap[66]
  },
  {
    id: 67,
    question: "But these conditions are heritable?",
    answer: `So is height. Heritability doesn't make something disease.

What's inherited: cognitive patterns that served different roles in the [EEA](/glossary#eea). Variations pathologized when the environment doesn't accommodate them.`,
    imageUrls: imageMap[67]
  },
  {
    id: 68,
    question: "What about brain differences?",
    answer: `Musicians have different brains. Taxi drivers have different brains. Difference is not pathology.

The "differences" might be consequences of [mismatch](/glossary#mismatch), not pre-existing conditions.`,
    imageUrls: imageMap[68]
  },
  {
    id: 69,
    question: "What about neuroplasticity?",
    answer: `The brain changes based on experience.

"Brain differences" in psychiatric conditions might be effects, not causes. Chronic [mismatch](/glossary#mismatch) reshapes neural architecture.`,
    imageUrls: imageMap[69]
  },
  {
    id: 70,
    question: "What's wrong with therapy?",
    answer: `Nothing—if it's a bridge to environmental change.

Problem: therapy as [proxy](/glossary#proxy). $200/hour paid intimacy substituting for [tribe](/glossary#the-150-tribe). Years of sessions, no environmental change.`,
    imageUrls: imageMap[70]
  },
  {
    id: 71,
    question: "What's a 15-minute medication check?",
    answer: `Standard psychiatry visit. Enough time to adjust dosage. Not enough to understand context.

Environment never discussed. There isn't time.`,
    imageUrls: imageMap[71]
  },
  {
    id: 72,
    question: "Is medication ever necessary?",
    answer: `Medication becomes "necessary" because we've destroyed social structures that would otherwise manage these states.

WHO studies: better outcomes in developing countries with less medication, more social support.`,
    imageUrls: imageMap[72]
  },
  {
    id: 73,
    question: "Do people actually die from this?",
    answer: `Yes.

Zoraya ter Beek, 29, euthanized after psychiatrists said "nothing more we can do." Without ever trying environmental intervention.`,
    imageUrls: imageMap[73]
  },
  {
    id: 74,
    question: "What did humans do together every night for 300,000 years?",
    answer: `The [fire circle](/glossary#fire-circle). 2-4 hours. Every single night.

Processing the day. Storytelling. Bonding. We replaced it with screens.`,
    imageUrls: imageMap[74]
  },
  {
    id: 75,
    question: "Were parents ever meant to raise kids alone?",
    answer: `No. [Alloparenting](/glossary#alloparenting)—child-rearing by 20+ adults.

The nuclear family is a historical aberration. Parental burnout isn't failure. It's asking two people to do what twenty did.`,
    imageUrls: imageMap[75]
  },
  {
    id: 76,
    question: "Why do we separate children by age?",
    answer: `Institutional convenience, not developmental necessity.

Mixed-age play was the norm. Five-year-olds learning from ten-year-olds. Natural mentorship.`,
    imageUrls: imageMap[76]
  },
  {
    id: 77,
    question: "What is apprenticeship?",
    answer: `Learning through observation and gradual participation. How humans learned everything for 300,000 years.

[Visible contribution](/glossary#visible-contribution) from early age. Purpose built in.`,
    imageUrls: imageMap[77]
  },
  {
    id: 78,
    question: "How did hunter-gatherers prevent poverty?",
    answer: `[Demand sharing](/glossary#demand-sharing). Those with surplus share when asked.

If someone asks when you have extra, you give. Tomorrow you might be asking. Poverty impossible within the group.`,
    imageUrls: imageMap[78]
  },
  {
    id: 79,
    question: "What was work like before money existed?",
    answer: `[Immediate-return](/glossary#immediate-return-economy). Resources consumed within hours.

Hunt → eat. Gather → consume. 3-4 hours of effort. Tangible results. [Closed loops](/glossary#closed-loop).`,
    imageUrls: imageMap[79]
  },
  {
    id: 80,
    question: "Did hunter-gatherers have leaders?",
    answer: `No permanent leaders. Different experts for different domains.

Best tracker led hunts. Best diplomat handled relations. Outside expertise: just a person.`,
    imageUrls: imageMap[80]
  },
  {
    id: 81,
    question: "How did tribes prevent anyone from taking over?",
    answer: `[Egalitarian enforcement](/glossary#egalitarian-enforcement). Active suppression of dominance.

Boasting, hoarding, bossing triggered immediate coalition response. Christopher Boehm: "reverse dominance hierarchy."`,
    imageUrls: imageMap[81]
  },
  {
    id: 82,
    question: "How did tribes handle conflict without police or courts?",
    answer: `The [conflict resolution cascade](/glossary#conflict-resolution-cascade): humor → public discussion → ridicule → shunning → exile → violence (rare).

Most resolved early through joking. Reputation was inescapable.`,
    imageUrls: imageMap[82]
  },
  {
    id: 83,
    question: "What about circadian rhythm?",
    answer: `Wake with light. Active through morning. Rest, nap in afternoon. [Fire circle](/glossary#fire-circle) at evening. Sleep with darkness.

No alarm clocks. No artificial light. [Circadian](/glossary#circadian-rhythm) regularity was automatic.`,
    imageUrls: imageMap[83]
  },
  {
    id: 84,
    question: "What is birth spacing?",
    answer: `3-4 years between children via extended breastfeeding.

Parents not overwhelmed. Grandmothers crucial. Aka fathers hold infants 20%+ of daytime.`,
    imageUrls: imageMap[84]
  },
  {
    id: 85,
    question: "What about physical contact for infants?",
    answer: `Constant. Babies rarely put down.

Carried all day. Co-sleeping at night. No prolonged distress. The [mismatch](/glossary#mismatch) begins at birth.`,
    imageUrls: imageMap[85]
  },
  {
    id: 86,
    question: "Is it normal for groups to break apart and reform?",
    answer: `Yes. [Fission-fusion](/glossary#fission-fusion)—natural social metabolism.

When conflict became unresolvable, one faction left. This wasn't dysfunction. It was how healthy groups breathed.`,
    imageUrls: imageMap[86]
  },
  {
    id: 87,
    question: "How did small tribes avoid becoming inbred?",
    answer: `The [metapopulation](/glossary#metapopulation). 500-1500 people across multiple tribes.

Seasonal gatherings. Marriage exchanges. You knew your [tribe](/glossary#the-150-tribe) intimately; you knew *of* the broader network.`,
    imageUrls: imageMap[87]
  },
  {
    id: 88,
    question: "Why do modern tribes need explicit governance?",
    answer: `Because we're hierarchy-damaged.

[EEA](/glossary#eea) mechanisms don't work automatically on people with corporate backgrounds. Explicit structures prevent recreating what we know.`,
    imageUrls: imageMap[88]
  },
  {
    id: 89,
    question: "What's the difference between a tribe and a cult?",
    answer: `Cult: charismatic leader, information control, isolation, punishment for leaving.

Tribe: distributed authority, [transparency](/glossary#transparency), embedded in society, [viable exit](/glossary#viable-exit).`,
    imageUrls: imageMap[89]
  },
  {
    id: 90,
    question: "How do you prevent someone from becoming the permanent leader?",
    answer: `[Rotation](/glossary#rotation). Power-accumulating roles rotate on schedule.

No one occupies influence positions permanently. Trades efficiency for equality.`,
    imageUrls: imageMap[90]
  },
  {
    id: 91,
    question: "Why does everyone need to see everything?",
    answer: `[Transparency](/glossary#transparency). Information asymmetry is proto-hierarchy.

When some know things others don't, those members have power. No back-channels. No faction building.`,
    imageUrls: imageMap[91]
  },
  {
    id: 92,
    question: "Why shouldn't one person hold multiple roles?",
    answer: `[Domain separation](/glossary#domain-separation). Power concentration through role accumulation.

Negotiator AND arbiter AND resource controller = dominance despite formal rules.`,
    imageUrls: imageMap[92]
  },
  {
    id: 93,
    question: "How do you keep manipulators out?",
    answer: `[Onboarding filter](/glossary#onboarding-filter). Trial period to surface dominance patterns before full inclusion.

People shaped by corporations may unconsciously attempt hierarchy. Better to discover early.`,
    imageUrls: imageMap[93]
  },
  {
    id: 94,
    question: "What if you want to leave?",
    answer: `[Viable exit](/glossary#viable-exit). You can. That's the point.

Unlike the [EEA](/glossary#eea), leaving doesn't mean death. You're held by value, not by bars. This distinguishes tribe from cult.`,
    imageUrls: imageMap[94]
  },
  {
    id: 95,
    question: "What went wrong with Auroville?",
    answer: `Scale without [Dunbar layers](/glossary#dunbars-numbers).

Tried flat governance at 3,000+ people. Lesson: [band-scale](/glossary#the-50-band) (50-150) as operating unit.`,
    imageUrls: imageMap[95]
  },
  {
    id: 96,
    question: "What would it mean to actually fix this?",
    answer: `[Demismatch](/glossary#demismatch). Conscious alignment of environment with biology.

Not returning to caves. Building forward with the spec sheet. The intervention isn't fixing yourself—it's changing conditions.`,
    imageUrls: imageMap[96]
  },
  {
    id: 97,
    question: "Why can't technology just fix you directly?",
    answer: `You can't [augment](/glossary#augment) broken.

If already [mismatched](/glossary#mismatch)—isolated, purposeless, stressed—technology amplifies dysfunction. [Demismatch](/glossary#demismatch) first, then augment.`,
    imageUrls: imageMap[97]
  },
  {
    id: 98,
    question: "Can technology enhance you once you're not broken?",
    answer: `Yes. That's [augment](/glossary#augment).

Communication coordinating actual [tribe](/glossary#the-150-tribe). AI extending capability, not replacing relationship. Foundation matters.`,
    imageUrls: imageMap[98]
  },
  {
    id: 99,
    question: "Can technology help, or does it only make things worse?",
    answer: `Both. [Pharmakon](/glossary#pharmakon)—Greek for both poison and cure.

Same tools creating [mismatch](/glossary#mismatch) can serve [demismatching](/glossary#demismatch). Implementation determines whether it heals or harms.`,
    imageUrls: imageMap[99]
  },
  {
    id: 100,
    question: "What if technology required you to meet in person?",
    answer: `[Decay function](/glossary#decay-function). Technology designed to degrade without physical presence.

Features that lock unless you've met recently. Success measured by *decreasing* use. Opposite of engagement optimization.`,
    imageUrls: imageMap[100]
  },
  {
    id: 101,
    question: "Can AI help you find your people?",
    answer: `Potentially. [Tribe formation AI](/glossary#tribe-formation-ai).

Matching based on nervous system regulation, conflict styles, values. Discovery tool, not relationship substitute.`,
    imageUrls: imageMap[101]
  },
  {
    id: 102,
    question: "Can you use existing technology to build real connection?",
    answer: `Yes. Does it serve your [150](/glossary#the-150-tribe) or substitute [parasocial](/glossary#parasocial-relationships) engagement?

Video calls with actual tribe? Yes. Infinite scroll among strangers? [Proxy](/glossary#proxy). Know the difference.`,
    imageUrls: imageMap[102]
  },
  {
    id: 103,
    question: "Why won't venture capital fund demismatch tech?",
    answer: `[Decay functions](/glossary#decay-function) are churn engines. VCs need engagement growth.

Technology succeeding by reducing usage can't grow metrics. Misalignment is structural.`,
    imageUrls: imageMap[103]
  },
  {
    id: 104,
    question: "What's the end goal of all this?",
    answer: `[The most human post-human](/glossary#the-most-human-post-human).

Matched environments, enhanced by technology. Baseline thriving plus capability enhancement. Meeting needs fully, then [augmenting](/glossary#augment).`,
    imageUrls: imageMap[104]
  },
  {
    id: 105,
    question: "How do you know if you've arrived?",
    answer: `Do you wake up with a role, in a group, with a goal?

If yes, you've arrived. If no, you haven't. No credentials required.`,
    imageUrls: imageMap[105]
  },
  {
    id: 106,
    question: "What do WHO studies show?",
    answer: `Better schizophrenia outcomes in developing countries with less medication, more social support.

Environment matters more than pharmaceuticals.`,
    imageUrls: imageMap[106]
  },
  {
    id: 107,
    question: "What do hunter-gatherer studies show?",
    answer: `Chronic psychiatric conditions rare or absent in genuinely matched populations.

Limited data, but directionally clear. [Mismatch](/glossary#mismatch) correlates with pathology.`,
    imageUrls: imageMap[107]
  },
  {
    id: 108,
    question: "What do environmental interventions show?",
    answer: `Nature exposure, co-living reduce symptoms independent of medication.

Change the environment, symptoms decrease—even without changing brain chemistry.`,
    imageUrls: imageMap[108]
  },
  {
    id: 109,
    question: "What do intentional communities show?",
    answer: `Long-term stability is possible with proper governance.

Twin Oaks (58 years). East Wind (51 years). Convergent solutions arrived at independently.`,
    imageUrls: imageMap[109]
  },
  {
    id: 110,
    question: "What is Twin Oaks?",
    answer: `Intentional community since 1967. ~100 adults.

Labor credits for [visible contribution](/glossary#visible-contribution). [Rotation](/glossary#rotation). [Transparency](/glossary#transparency). High life satisfaction.`,
    imageUrls: imageMap[110]
  },
  {
    id: 111,
    question: "What is East Wind?",
    answer: `Intentional community since 1974. ~70 members.

Nut butter business. Rotating coordinators. Full [transparency](/glossary#transparency). Reduced anxiety from belonging.`,
    imageUrls: imageMap[111]
  },
  {
    id: 112,
    question: "What's step one?",
    answer: `Reduce [mismatch](/glossary#mismatch) load.

Audit [parasocial relationships](/glossary#parasocial-relationships). Reduce [open loops](/glossary#open-loop). [Circadian](/glossary#circadian-rhythm) basics. Move your body. Don't build [tribe](/glossary#the-150-tribe) while maximally mismatched.`,
    imageUrls: imageMap[112]
  },
  {
    id: 113,
    question: "What's step two?",
    answer: `Deepen, not broaden.

Stop meeting new people temporarily. Invest in existing relationships. Identify your actual [5](/glossary#the-5). Depth over breadth.`,
    imageUrls: imageMap[113]
  },
  {
    id: 114,
    question: "What's step three?",
    answer: `Reduce [proxy](/glossary#proxy) dependence.

Notice which [proxies](/glossary#proxy) you're using. Time-box their use while building real alternatives. Can't quit cold turkey without something real.`,
    imageUrls: imageMap[114]
  },
  {
    id: 115,
    question: "What's step four?",
    answer: `Build.

One dinner. One finished project. One person who sees your contribution. One [closed loop](/glossary#closed-loop). Understanding changes nothing.`,
    imageUrls: imageMap[115]
  },
  {
    id: 116,
    question: "What's the smallest change you can make right now?",
    answer: `Identify your [5](/glossary#the-5). One shared meal per week. One [loop](/glossary#closed-loop) closed daily. Morning light. Movement.

Minimum viable [demismatch](/glossary#demismatch).`,
    imageUrls: imageMap[116]
  },
  {
    id: 117,
    question: "What if you can't build tribe right now?",
    answer: `Reduce [mismatch](/glossary#mismatch) load first.

[Circadian](/glossary#circadian-rhythm) alignment, nature exposure, reduced strangers. Move from 90% mismatched to 70%. Better positioned for later.`,
    imageUrls: imageMap[117]
  },
  {
    id: 118,
    question: "How long does this take?",
    answer: `Years, not weeks.

The [double shift](/glossary#double-shift) makes it slow. Anyone promising quick fixes is selling another [proxy](/glossary#proxy).`,
    imageUrls: imageMap[118]
  },
  {
    id: 119,
    question: "Why is building a new life so exhausting?",
    answer: `The [double shift](/glossary#double-shift).

8 hours capitalist work + 2-3 hours tribal maintenance. Unsustainable long-term. Something has to give.`,
    imageUrls: imageMap[119]
  },
  {
    id: 120,
    question: "Why do most attempts at this fail?",
    answer: `The [great filter](/glossary#great-filter). [Double shift](/glossary#double-shift) burnout, resource constraints, emerging hierarchies.

Not character failure. Predictable difficulty. [Fission-fusion](/glossary#fission-fusion) means "failure" might be one stage in a longer process.`,
    imageUrls: imageMap[120]
  },
  {
    id: 121,
    question: "Who can attempt this first?",
    answer: `People with resources: flexibility, savings, existing relationships.

Not fair, but realistic. First adopters create maps others follow.`,
    imageUrls: imageMap[121]
  },
  {
    id: 122,
    question: "What if your tribe attempt fails?",
    answer: `[Fission-fusion](/glossary#fission-fusion) is normal.

Even temporary tribes are valuable. Skills developed. Relationships persist. First attempt teaches. Second builds on it.`,
    imageUrls: imageMap[122]
  },
  {
    id: 123,
    question: "What's the most common mistake people make?",
    answer: `Reading about [mismatch](/glossary#mismatch) while sitting alone, scrolling, under artificial light.

Understanding is not progress. Close this tab. Find your people. Build something.`,
    imageUrls: imageMap[123]
  },
  {
    id: 124,
    question: "Will life be meaningful without struggle?",
    answer: `Yes. Constructive scarcity remains.

Challenges requiring effort, cooperation, skill. The [tribe](/glossary#the-150-tribe) still needs to raise children, resolve conflicts, create together. Meaning requires challenge, not suffering.`,
    imageUrls: imageMap[124]
  },
  {
    id: 125,
    question: "Isn't some suffering necessary?",
    answer: `Material deprivation? No—toxic scarcity. Challenge and effort? Yes—constructive scarcity.

Toxic is imposed and traumatizing. Constructive is chosen and growth-producing.`,
    imageUrls: imageMap[125]
  },
  {
    id: 126,
    question: "Why isn't UBI the answer?",
    answer: `Solves resource distribution, not meaning.

Money without role, [tribe](/glossary#the-150-tribe), purpose. UBI + [atomized individual](/glossary#atomized-individual) = comfortable meaninglessness.`,
    imageUrls: imageMap[126]
  },
  {
    id: 127,
    question: "What does automation change?",
    answer: `Eliminates human roles in production.

The [proxy](/glossary#proxy) purpose work provides is disappearing. Rebuild meaning through [tribe](/glossary#the-150-tribe), not jobs that won't exist.`,
    imageUrls: imageMap[127]
  },
  {
    id: 128,
    question: "What drives all human behavior?",
    answer: `Survive and reproduce.

[Direct fitness](/glossary#direct-fitness): hunger, fear, lust. [Indirect fitness](/glossary#indirect-fitness): status, reputation, coalition. No exceptions.`,
    imageUrls: imageMap[128]
  },
  {
    id: 129,
    question: "Why do you have urges you can't control?",
    answer: `[Direct fitness](/glossary#direct-fitness). Survival and reproduction mechanisms running automatically.

The system isn't malfunctioning. It's doing exactly what it evolved to do.`,
    imageUrls: imageMap[129]
  },
  {
    id: 130,
    question: "Why do you need other people's approval so badly?",
    answer: `[Indirect fitness](/glossary#indirect-fitness). Survival through social mechanisms.

What people thought determined whether you ate, found mates, got protected. The drive isn't weakness—it's machinery.`,
    imageUrls: imageMap[130]
  },
  {
    id: 131,
    question: "Why do you feel obligated to return favors?",
    answer: `[Reciprocal altruism](/glossary#reciprocal-altruism). Foundation of cooperation beyond kinship.

You help today, they help tomorrow. The feeling of obligation is evolved infrastructure.`,
    imageUrls: imageMap[131]
  },
  {
    id: 132,
    question: "What's the difference between wants and needs?",
    answer: `Wants: fame, money, perfect life. Needs: small [tribe](/glossary#the-150-tribe), real connection, security.

Wants are shaped by [mismatch](/glossary#mismatch). Chasing wants while needs go unmet = permanent dissatisfaction.`,
    imageUrls: imageMap[132]
  },
  {
    id: 133,
    question: "Can you train yourself to maintain more relationships?",
    answer: `No. The limit is biological.

Finite neocortex. Finite time. You can have more followers. You can't have more friends. [Dunbar's numbers](/glossary#dunbars-numbers) aren't failure—they're architecture.`,
    imageUrls: imageMap[133]
  },
  {
    id: 134,
    question: "What's the right size for a real community?",
    answer: `The [band](/glossary#the-50-band): ~50 people. 5-8 families in daily interaction.

Share meals. Work alongside. [Fire circle](/glossary#fire-circle) every night. This is what your hardware expects.`,
    imageUrls: imageMap[134]
  },
  {
    id: 135,
    question: "Why do you feel like a stranger in your own city?",
    answer: `Because you are. Beyond [150](/glossary#the-150-tribe), everyone is a stranger.

Millions of people, no one you know. [Dunbar's limit](/glossary#dunbars-numbers) in action.`,
    imageUrls: imageMap[135]
  },
  {
    id: 136,
    question: "Can technology extend Dunbar's number?",
    answer: `Weak ties, yes. Strong ties, no.

Technology lets you stay loosely connected to more people. Cannot make you capable of intimate relationship with more than [5](/glossary#the-5).`,
    imageUrls: imageMap[136]
  },
  {
    id: 137,
    question: "Why does your brain lie to you about what you need?",
    answer: `It's not lying—it's running outdated software.

Calibrated for survival in the [EEA](/glossary#eea), not for truth. The dashboard was designed for different terrain.`,
    imageUrls: imageMap[137]
  },
  {
    id: 138,
    question: "Do you perceive reality accurately?",
    answer: `No. You perceive a dashboard.

Evolution optimized for survival, not accuracy. Truth was never the goal. Fitness was.`,
    imageUrls: imageMap[138]
  },
  {
    id: 139,
    question: "Why are mass shootings a modern phenomenon?",
    answer: `Killing strangers would be inconceivable in the [EEA](/glossary#eea).

Everyone was known. [Stranger overload](/glossary#stranger-overload) makes strangers into categories. Categories are easier to kill.`,
    imageUrls: imageMap[139]
  },
  {
    id: 140,
    question: "Is this just \"we weren't meant to live like this\"?",
    answer: `Yes, but with 300,000 years of evidence and a specific spec sheet.

Not nostalgia. Biology. The [EEA](/glossary#eea) is documented. The [mismatch](/glossary#mismatch) is measurable.`,
    imageUrls: imageMap[140]
  },
  {
    id: 141,
    question: "Is all entertainment bad for you?",
    answer: `No. Art isn't [proxy](/glossary#proxy).

Art continues [fire circle](/glossary#fire-circle) function: processing, sense-making, truth-telling. [Proxies](/glossary#proxy) deplete. Art nourishes.`,
    imageUrls: imageMap[141]
  },
  {
    id: 142,
    question: "Is this anti-psychiatry?",
    answer: `Anti-misdiagnosis.

Psychiatric conditions are real patterns. They're just not diseases—they're responses to [mismatch](/glossary#mismatch). Different diagnosis, different solutions.`,
    imageUrls: imageMap[142]
  },
  {
    id: 143,
    question: "Is this anti-technology?",
    answer: `No. Technology is [pharmakon](/glossary#pharmakon)—both poison and cure.

Same tools creating [mismatch](/glossary#mismatch) can serve [demismatching](/glossary#demismatch). Depends on design.`,
    imageUrls: imageMap[143]
  },
  {
    id: 144,
    question: "What is this website?",
    answer: `A framework explaining why modern humans suffer and what conditions would let them thrive.

Not therapy. Not self-help. A spec sheet for human nature.`,
    imageUrls: imageMap[144]
  },
  {
    id: 145,
    question: "What are you trying to do?",
    answer: `Change how people understand suffering.

It's not you. It's the environment. Once you see it, you can't unsee it.`,
    imageUrls: imageMap[145]
  },
  {
    id: 146,
    question: "Why should you care?",
    answer: `Because you're probably suffering and blaming yourself.

Because "solutions" haven't worked. Because understanding the problem is step one.`,
    imageUrls: imageMap[146]
  },
  {
    id: 147,
    question: "Who is this for?",
    answer: `Anyone who feels something is deeply wrong but can't name it.

Therapists tired of band-aids. Technologists who want to build things that help. Parents watching kids struggle.`,
    imageUrls: imageMap[147]
  },
  {
    id: 148,
    question: "What should you do after reading this?",
    answer: `Stop blaming yourself. Understand the pattern. Then build.

Your own [tribe](/glossary#the-150-tribe). Your own closure. Your own [visible contribution](/glossary#visible-contribution). Understanding alone changes nothing.`,
    imageUrls: imageMap[148]
  },
  {
    id: 149,
    question: "Why is this free?",
    answer: `No one owns truth about human nature.

Fork it, improve it, implement it. The point is not to profit—the point is for you to stop suffering.`,
    imageUrls: imageMap[149]
  },
  {
    id: 150,
    question: "What's with all the images?",
    answer: `2,500+ visuals in the library. Framework is dense. Images make it visceral.

Use them. They're free too.`,
    imageUrls: imageMap[150]
  },
  {
    id: 151,
    question: "How do you know this isn't just another self-help thing?",
    answer: `Self-help sells individual solutions to systemic problems.

This framework says: problem is environmental, solution is collective, personal optimization is part of the problem.`,
    imageUrls: imageMap[151]
  },
  {
    id: 152,
    question: "\"You're an introvert.\"",
    answer: `Introversion = how you recover, not what you need.

You need [tribe](/glossary#the-150-tribe) with a quieter role. The [EEA](/glossary#eea) had roles for every temperament. Introverts still need their [5](/glossary#the-5).`,
    imageUrls: imageMap[152]
  },
  {
    id: 153,
    question: "\"Different people need different things.\"",
    answer: `Surface variation exists. Deep structure is universal.

No human thrives isolated, purposeless, surrounded by strangers, with permanent [open loops](/glossary#open-loop).`,
    imageUrls: imageMap[153]
  },
  {
    id: 154,
    question: "\"You're romanticizing the past.\"",
    answer: `27% infant mortality. 48% child death before 15. Violence, scarcity, disease.

The framework claims the *social* environment matched hardware. You can have modern medicine AND social structures that work.`,
    imageUrls: imageMap[154]
  },
  {
    id: 155,
    question: "\"This sounds like a cult.\"",
    answer: `Cults: charismatic leader, isolation, information control, punishment for leaving.

Framework: no leader, [transparency](/glossary#transparency), embedded in society, [viable exit](/glossary#viable-exit). This is a document.`,
    imageUrls: imageMap[155]
  },
  {
    id: 156,
    question: "\"Society can't reorganize.\"",
    answer: `Society doesn't need to. *You* need to build [tribe](/glossary#the-150-tribe) within existing society.

Social layer, not replacement for civilization. You still have job, government. You also have your [50](/glossary#the-50-band).`,
    imageUrls: imageMap[156]
  },
  {
    id: 157,
    question: "\"Only privileged people can do this.\"",
    answer: `Partly true. First tribes from those who can experiment.

Also: many "underprivileged" communities already have more tribal structure. Wealth often correlates with isolation.`,
    imageUrls: imageMap[157]
  },
  {
    id: 158,
    question: "\"What about people who genuinely can't form relationships?\"",
    answer: `Some neurological differences exist.

Framework claims *most* suffering is environmental. For genuine difference: modified structures, different roles. Everyone needs their version of [tribe](/glossary#the-150-tribe).`,
    imageUrls: imageMap[158]
  },
  {
    id: 159,
    question: "\"Isn't this just 'touch grass' with extra steps?\"",
    answer: `Yes and no.

"Touch grass" captures something real. Framework explains *why* and what else is needed. Touch grass is necessary but insufficient.`,
    imageUrls: imageMap[159]
  },
  {
    id: 160,
    question: "What's the one thing you should remember?",
    answer: `You're not broken. Your environment is [mismatched](/glossary#mismatch).

Stop fixing yourself. Start building conditions that would let you thrive. The [fish](/glossary#fish-on-land) needs water.`,
    imageUrls: imageMap[160]
  },
  {
    id: 161,
    question: "What now?",
    answer: `Close this tab.

You've understood enough. Only building helps. Go find one person. Make one meal. Close one [loop](/glossary#closed-loop). Start.`,
    imageUrls: imageMap[161]
  }
];

// Parse markdown-style links and text formatting
function parseAnswer(text: string, onGlossaryClick: (termId: string) => void): React.ReactNode[] {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let lineKey = 0;

  const processLine = (line: string, key: number): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    let partKey = 0;

    let processedLine = line;
    processedLine = processedLine.replace(/\*\*([^*]+)\*\*/g, '###BOLD_START###$1###BOLD_END###');
    processedLine = processedLine.replace(/\*([^*]+)\*/g, '###ITALIC_START###$1###ITALIC_END###');

    while ((match = linkRegex.exec(processedLine)) !== null) {
      if (match.index > lastIndex) {
        const beforeText = processedLine.substring(lastIndex, match.index);
        parts.push(...renderFormattedText(beforeText, `before-${key}-${partKey++}`));
      }

      const linkText = match[1];
      const href = match[2];

      // Check if it's a glossary link
      if (href.startsWith('/glossary#')) {
        const termId = href.replace('/glossary#', '');
        parts.push(
          <button
            key={`link-${key}-${partKey++}`}
            onClick={(e) => {
              e.stopPropagation();
              onGlossaryClick(termId);
            }}
            className="text-[#C75B39] hover:underline font-medium cursor-pointer"
          >
            {linkText}
          </button>
        );
      } else {
        parts.push(
          <Link
            key={`link-${key}-${partKey++}`}
            href={href}
            className="text-[#C75B39] hover:underline font-medium"
          >
            {linkText}
          </Link>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < processedLine.length) {
      const remaining = processedLine.substring(lastIndex);
      parts.push(...renderFormattedText(remaining, `after-${key}-${partKey}`));
    }

    return parts.length > 0 ? parts : processedLine;
  };

  const renderFormattedText = (text: string, keyPrefix: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    const parts = text.split(/(###BOLD_START###|###BOLD_END###|###ITALIC_START###|###ITALIC_END###)/);
    let inBold = false;
    let inItalic = false;
    let partIdx = 0;

    for (const part of parts) {
      if (part === '###BOLD_START###') {
        inBold = true;
      } else if (part === '###BOLD_END###') {
        inBold = false;
      } else if (part === '###ITALIC_START###') {
        inItalic = true;
      } else if (part === '###ITALIC_END###') {
        inItalic = false;
      } else if (part) {
        if (inBold) {
          result.push(<strong key={`${keyPrefix}-${partIdx++}`}>{part}</strong>);
        } else if (inItalic) {
          result.push(<em key={`${keyPrefix}-${partIdx++}`}>{part}</em>);
        } else {
          result.push(part);
        }
      }
    }

    return result;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed === '') return;

    elements.push(
      <p key={`p-${lineKey++}`} className="text-gray-700 mb-3 leading-relaxed last:mb-0">
        {processLine(trimmed, idx)}
      </p>
    );
  });

  return elements;
}

export default function HomepageFAQTile() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagePopup, setImagePopup] = useState<number | null>(null);  // Index of image to show in popup, or null
  const [glossaryPopup, setGlossaryPopup] = useState<string | null>(null);

  // Persist progress in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tile-index');
    if (saved) {
      const idx = parseInt(saved, 10);
      if (!isNaN(idx) && idx >= 0 && idx < tileData.length) {
        setCurrentIndex(idx);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tile-index', currentIndex.toString());
  }, [currentIndex]);

  // Close popups on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setImagePopup(null);
        setGlossaryPopup(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const currentQ = tileData[currentIndex];
  const nextQ = tileData[(currentIndex + 1) % tileData.length];

  const handleGlossaryClick = (termId: string) => {
    setGlossaryPopup(termId);
  };

  const glossaryTerm = glossaryPopup ? glossaryById[glossaryPopup] : null;

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsRevealed(false);
      setCurrentIndex((prev) => (prev + 1) % tileData.length);
      setIsTransitioning(false);
      // Auto-reveal after transition
      setTimeout(() => setIsRevealed(true), 50);
    }, 200);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsRevealed(false);
      setCurrentIndex((prev) => (prev - 1 + tileData.length) % tileData.length);
      setIsTransitioning(false);
      setTimeout(() => setIsRevealed(true), 50);
    }, 200);
  };

  const handleRewind = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsRevealed(false);
      setCurrentIndex(0);
      setIsTransitioning(false);
    }, 200);
  };

  return (
    <section className="py-20 max-w-5xl mx-auto px-4 md:px-8">
      {/* Animation styles */}
      <style jsx global>{`
        @keyframes faq-reveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .faq-reveal-anim {
          animation: faq-reveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Section Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="section-divider-thick mb-4" />
          <h2 className="headline-secondary text-[#0A0A0A]">
            Quick <span className="text-[#C75B39]">Answers</span>
          </h2>
        </div>
        <Link
          href="/faq"
          className="text-sm font-bold uppercase tracking-widest text-[#C75B39] hover:text-[#A84A2D] transition-colors flex items-center gap-2"
        >
          <span>All 160</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      <div
        className={`transition-all duration-500 ${
          isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
        }`}
      >
        {/* THE QUESTION — Using site's color-blocked style */}
        <div
          className={`relative overflow-hidden ${!isRevealed ? 'cursor-pointer group' : ''}`}
          onClick={!isRevealed ? handleReveal : undefined}
          style={{ backgroundColor: '#C75B39' }}
        >
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-grid opacity-10" />

          <div className="relative p-8 md:p-12">
            {/* Question number badge */}
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-12 flex items-center justify-center bg-white/20 text-white font-bold text-lg">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">
                of {tileData.length}
              </span>
            </div>

            {/* THE HEADLINE — ALL CAPS for bold, brave, direct impact */}
            <h3
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight font-black uppercase tracking-wide"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {currentQ.question}
            </h3>

            {/* Reveal CTA */}
            {!isRevealed && (
              <div className="mt-8 flex items-center gap-4">
                <span className="text-white/80 text-sm font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                  Click to reveal
                </span>
                <div className="h-px bg-white/30 w-8 group-hover:w-16 transition-all duration-500" />
                <svg className="w-5 h-5 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* THE ANSWER */}
        {isRevealed && (
          <div className="faq-reveal-anim">
            {/* Answer content — White background */}
            <div className="bg-white border-l-4 border-[#C75B39]">
              <div className="p-8 md:p-12">
                {/* Answer text */}
                <div className="text-lg md:text-xl text-[#4A4A4A] leading-relaxed space-y-4 max-w-2xl">
                  {parseAnswer(currentQ.answer, handleGlossaryClick)}
                </div>

                {/* Image Gallery */}
                <div className="mt-10">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#8B8B8B] mb-4">Related Images</p>
                  <div className="flex gap-3 flex-wrap">
                    {currentQ.imageUrls.slice(0, 5).map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setImagePopup(idx)}
                        className="group/img relative flex-shrink-0 hover-tilt"
                        title="Click to enlarge"
                      >
                        <div className="relative w-24 h-24 md:w-32 md:h-32 overflow-hidden border border-[#E5E0D8] bg-[#F0EDE6]">
                          <Image
                            src={url}
                            alt={`${currentQ.question} - image ${idx + 1}`}
                            width={128}
                            height={128}
                            className="object-cover w-full h-full group-hover/img:scale-110 transition-transform duration-500"
                          />
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-[#C75B39]/0 group-hover/img:bg-[#C75B39]/20 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* NEXT QUESTION TEASER — Dark section */}
            <div
              className="bg-[#0A0A0A] cursor-pointer group/next"
              onClick={handleNext}
            >
              <div className="p-8 md:p-12 flex items-center justify-between gap-6">
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#C75B39] mb-3">
                    Up Next
                  </p>
                  <p
                    className="text-lg md:text-xl lg:text-2xl text-white/70 group-hover/next:text-white leading-tight font-bold uppercase tracking-wide transition-colors"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {nextQ.question}
                  </p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center bg-[#C75B39] text-white group-hover/next:bg-white group-hover/next:text-[#C75B39] transition-all">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION BAR */}
        <div className="bg-[#F0EDE6] border-t border-[#E5E0D8]">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Nav controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleRewind}
                className="w-10 h-10 flex items-center justify-center text-[#8B8B8B] hover:text-[#C75B39] hover:bg-white transition-all"
                title="Back to first"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handlePrev}
                className="w-10 h-10 flex items-center justify-center text-[#8B8B8B] hover:text-[#C75B39] hover:bg-white transition-all"
                title="Previous"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 flex items-center justify-center text-[#8B8B8B] hover:text-[#C75B39] hover:bg-white transition-all"
                title="Next"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3 flex-1 max-w-xs mx-4">
              <div className="flex-1 h-1 bg-[#E5E0D8] relative">
                <div
                  className="absolute left-0 top-0 h-full bg-[#C75B39] transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / tileData.length) * 100}%` }}
                />
              </div>
              <span className="text-sm text-[#8B8B8B] font-bold tabular-nums">
                {currentIndex + 1}/{tileData.length}
              </span>
            </div>

            {/* View all link */}
            <Link
              href="/faq"
              className="btn-secondary !py-2 !px-4 !text-xs"
            >
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* Image Popup Modal */}
      {imagePopup !== null && (
        <div
          className="modal-overlay"
          onClick={() => setImagePopup(null)}
        >
          <div
            className="modal-content max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setImagePopup(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#0A0A0A] text-white flex items-center justify-center hover:bg-[#C75B39] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Navigation arrows for gallery */}
            {currentQ.imageUrls.length > 1 && (
              <>
                <button
                  onClick={() => setImagePopup(imagePopup > 0 ? imagePopup - 1 : currentQ.imageUrls.length - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#0A0A0A] text-white flex items-center justify-center hover:bg-[#C75B39] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setImagePopup(imagePopup < currentQ.imageUrls.length - 1 ? imagePopup + 1 : 0)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#0A0A0A] text-white flex items-center justify-center hover:bg-[#C75B39] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            <div className="relative w-full aspect-square bg-[#F0EDE6]">
              <Image
                src={currentQ.imageUrls[imagePopup]}
                alt={`${currentQ.question} - image ${imagePopup + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
            {/* Image indicator dots */}
            {currentQ.imageUrls.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {currentQ.imageUrls.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImagePopup(idx)}
                    className={`w-3 h-3 transition-colors ${
                      idx === imagePopup ? 'bg-[#C75B39]' : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Glossary Popup Modal */}
      {glossaryPopup && glossaryTerm && (
        <div
          className="modal-overlay"
          onClick={() => setGlossaryPopup(null)}
        >
          <div
            className="modal-content max-w-lg w-full max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setGlossaryPopup(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#0A0A0A] text-white flex items-center justify-center hover:bg-[#C75B39] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-8 overflow-y-auto">
              <p className="text-xs font-bold uppercase tracking-widest text-[#C75B39] mb-2">Glossary</p>
              <h3 className="headline-secondary text-[#0A0A0A] mb-6 pr-8">
                {glossaryTerm.title}
              </h3>
              <div className="space-y-4">
                {glossaryTerm.definition.map((paragraph, idx) => (
                  <p key={idx} className="text-[#4A4A4A] text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
