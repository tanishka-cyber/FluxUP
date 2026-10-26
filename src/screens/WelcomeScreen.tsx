import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// SVG lets us create the custom flowing artwork in the background.
import Svg, { Circle, Path } from "react-native-svg";


/* ================================================================
   WELCOME SCREEN

   This is Screen 1 of Flux.

   The two functions below come from App.tsx:

   onCreateSchedule
   → Runs when the user taps "Create my schedule"

   onSignIn
   → Runs when the user taps "Sign in"

   Keeping these functions here makes the screen responsible for
   the visual design while App.tsx controls which screen is shown.
================================================================ */

export default function WelcomeScreen({
    onCreateSchedule,
    onSignIn,
}: {
    // Function that runs when "Create my schedule" is pressed.
    onCreateSchedule: () => void;

    // Function that runs when "Sign in" is pressed.
    onSignIn: () => void;
}) {
    return (

        // ScrollView allows the screen to scroll on smaller devices.
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >

            {/* =====================================================
                MAIN FLUX SCREEN

                This is the actual app/phone-shaped area.
            ===================================================== */}
            <View style={styles.screen}>


                {/* =================================================
                    BACKGROUND ARTWORK

                    Everything inside this View sits behind the
                    actual FluxUP content.

                    pointerEvents="none" means the artwork cannot
                    interfere with button presses.
                ================================================= */}
                <View
                    style={styles.background}
                    pointerEvents="none"
                >

                    {/* SVG canvas for the abstract FluxUP artwork */}
                    <Svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 390 844"
                        preserveAspectRatio="none"
                    >


                        {/* =========================================
                            BLUE FLOWING SHAPE

                            fill = color of the shape

                            The "d" controls the actual shape.

                            You normally don't need to edit the
                            "d" unless you want to reshape it.
                        ========================================= */}
                        <Path
                            d="
                                M-40 250
                                C25 215 65 190 110 180
                                C150 171 174 184 202 207
                                C229 229 251 231 278 211
                                C306 190 326 158 356 151
                                C384 145 408 158 430 177
                                L430 282
                                C388 267 353 260 320 272
                                C281 286 253 307 214 303
                                C172 299 149 271 119 263
                                C81 253 42 279 -40 315
                                Z
                            "
                            fill="#D4EDF2"
                        />


                        {/* =========================================
                            GREEN FLOWING SHAPE
                        ========================================= */}
                        <Path
                            d="
                                M173 215
                                C216 237 247 244 275 224
                                C304 204 321 171 348 156
                                C375 141 403 145 430 160
                                L430 335
                                C397 322 370 304 344 297
                                C316 290 298 301 274 316
                                C244 334 213 325 195 303
                                C176 281 163 246 173 215
                                Z
                            "
                            fill="#D7F0D4"
                        />


                        {/* =========================================
                            PURPLE FLOWING SHAPE
                        ========================================= */}
                        <Path
                            d="
                                M-40 309
                                C22 293 59 271 98 252
                                C137 233 162 231 190 247
                                C219 264 231 285 258 286
                                C286 287 312 266 340 252
                                C369 238 400 245 430 266
                                L430 326
                                C383 314 351 313 325 324
                                C291 338 267 358 230 357
                                C187 356 165 326 132 314
                                C94 300 56 326 -40 354
                                Z
                            "
                            fill="#DED9F3"
                        />


                        {/* =========================================
                            PINK SHAPE
                        ========================================= */}
                        <Path
                            d="
                                M-35 266
                                C7 237 41 226 72 236
                                C104 246 116 274 103 299
                                C90 324 56 335 22 327
                                C-4 321 -23 306 -35 294
                                Z
                            "
                            fill="#F5DDE4"
                        />


                        {/* =========================================
                            YELLOW SHAPE
                        ========================================= */}
                        <Path
                            d="
                                M269 357
                                C300 338 328 332 353 341
                                C380 350 400 370 430 385
                                L430 512
                                C392 495 367 480 338 482
                                C307 484 288 502 268 501
                                C239 499 224 475 231 447
                                C237 416 248 382 269 357
                                Z
                            "
                            fill="#F7E9BE"
                        />


                        {/* =================================================
                            SMALL DECORATIVE DETAILS
                        ================================================= */}

                        {/* Small turquoise dot */}
                        <Circle
                            cx="270"
                            cy="255"
                            r="3"
                            fill="#72C9C0"
                        />


                        {/* Small curved decorative line */}
                        <Path
                            d="M270 261 C298 249 321 247 344 252"
                            fill="none"
                            stroke="#9DD9C0"
                            strokeWidth="2"
                        />


                        {/* =================================================
                            BOTTOM DECORATION
                        ================================================= */}

                        {/* Bottom-left green shape */}
                        <Path
                            d="
                                M-25 807
                                C27 777 70 766 107 778
                                C144 790 162 818 183 850
                                L-25 850
                                Z
                            "
                            fill="#DCEFD6"
                        />


                        {/* Bottom-right blue shape */}
                        <Path
                            d="
                                M283 850
                                C290 815 309 792 337 781
                                C367 770 399 782 430 802
                                L430 850
                                Z
                            "
                            fill="#D5ECEF"
                        />


                        {/* Bottom-right yellow shape */}
                        <Path
                            d="
                                M340 850
                                C350 823 369 809 390 809
                                C407 808 420 814 430 820
                                L430 850
                                Z
                            "
                            fill="#F7E6B2"
                        />

                    </Svg>

                </View>


                {/* =====================================================
                    HEADER

                    Contains:
                    - FluxUP logo
                    - Top-right sparkle
                ===================================================== */}
                <View style={styles.header}>

                    {/* FluxUP logo */}
                    <Text style={styles.logo}>
                        FluxUP
                    </Text>


                    {/* Top-right sparkle */}
                    <Text style={styles.sparkle}>
                        ✦
                    </Text>

                </View>


                {/* =====================================================
                    MAIN CONTENT
                ===================================================== */}
                <View style={styles.content}>


                    {/* -------------------------------------------------
                        EMPTY SPACE ABOVE THE HEADLINE

                        Increase height → moves headline DOWN.

                        Decrease height → moves headline UP.

                        This is one of the easiest values to adjust.
                    ------------------------------------------------- */}
                    <View style={styles.spacer} />


                    {/* -------------------------------------------------
                        MAIN HEADLINE
                    ------------------------------------------------- */}
                    <Text style={styles.title}>
                        Your school life,{"\n"}
                        intelligently planned.
                    </Text>


                    {/* -------------------------------------------------
                        SUPPORTING DESCRIPTION
                    ------------------------------------------------- */}
                    <Text style={styles.description}>
                        FluxUP turns your classes, assignments, tests,
                        commitments, and available time into a schedule
                        that adapts with you.
                    </Text>


                    {/* =================================================
                        BUTTONS
                    ================================================= */}
                    <View style={styles.buttons}>


                        {/* =================================================
                            PRIMARY BUTTON

                            "Create my schedule"

                            onPress={onCreateSchedule} connects this
                            button to App.tsx.
                        ================================================= */}
                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={styles.primaryButton}
                            onPress={onCreateSchedule}
                        >

                            <Text style={styles.primaryText}>
                                Create my schedule
                            </Text>


                            {/* Arrow inside the button */}
                            <Text style={styles.arrow}>
                                →
                            </Text>

                        </TouchableOpacity>


                        {/* =================================================
                            SECONDARY BUTTON

                            "Sign in"

                            onPress={onSignIn} connects this button
                            to App.tsx.
                        ================================================= */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.secondaryButton}
                            onPress={onSignIn}
                        >

                            <Text style={styles.secondaryText}>
                                Sign in
                            </Text>

                        </TouchableOpacity>

                    </View>

                </View>


                {/* =====================================================
                    BOTTOM DECORATIVE SPARKLE
                ===================================================== */}
                <View style={styles.bottomSparkle}>

                    <Text style={styles.bottomSparkleText}>
                        ✦
                    </Text>

                </View>

            </View>

        </ScrollView>
    );
}


/* =================================================================
   STYLES

   Most visual changes you make will happen down here.

   You can change:
   - sizes
   - colors
   - spacing
   - positions
   - text sizes
   - button shapes
   - logo appearance
   - sparkle appearance

   You generally DON'T need to touch the React code above when
   you're only changing the appearance.
================================================================= */

const styles = StyleSheet.create({


    /* =============================================================
       OUTER SCROLLVIEW

       This controls the area surrounding the FluxUP screen.
    ============================================================= */
    container: {
        flex: 1,

        // Background visible outside the main app screen.
        backgroundColor: "#F3F3EF",
    },


    /* Allows ScrollView content to fill the available height */
    scrollContent: {
        flexGrow: 1,
    },


    /* =============================================================
       MAIN FLUX SCREEN
    ============================================================= */
    screen: {

        // Minimum height of the FluxUP screen.
        //
        // Increase → taller screen.
        // Decrease → shorter screen.
        minHeight: 844,

        // Use the available width.
        width: "100%",

        // Prevents FluxUP from becoming extremely wide on desktop.
        maxWidth: 430,

        // Centers the screen when viewed in a wide browser.
        alignSelf: "center",

        // Main warm/off-white FluxUP background.
        backgroundColor: "#FFFDF8",

        // Keeps SVG artwork inside the screen.
        overflow: "hidden",

        // Allows decorations to use absolute positioning.
        position: "relative",
    },


    /* =============================================================
       BACKGROUND ARTWORK CONTAINER

       absoluteFill makes the background cover the entire screen.
    ============================================================= */
    background: {
        ...StyleSheet.absoluteFill,
    },


    /* =============================================================
       HEADER
    ============================================================= */
    header: {

        // Height of the header.
        height: 78,

        // Horizontal space between the screen edge and content.
        //
        // Increase → logo/sparkle move inward.
        // Decrease → logo/sparkle move closer to edges.
        paddingHorizontal: 26,

        // Places logo and sparkle on the same row.
        flexDirection: "row",

        // Centers them vertically.
        alignItems: "center",

        // Logo goes left, sparkle goes right.
        justifyContent: "space-between",

        // Makes header appear above the background artwork.
        zIndex: 2,
    },


    /* =============================================================
       FLUX LOGO
    ============================================================= */
    logo: {

        // Logo text size.
        fontSize: 29,

        // Height of the text area.
        lineHeight: 34,

        // 800 = very bold.
        fontWeight: "800",

        // Negative = tighter letters.
        letterSpacing: -1.5,

        // FluxUP teal.
        color: "#087A70",
    },


    /* =============================================================
       TOP-RIGHT SPARKLE
    ============================================================= */
    sparkle: {

        // Sparkle size.
        fontSize: 23,

        lineHeight: 28,

        // Sparkle color.
        color: "#55C8BC",
    },


    /* =============================================================
       MAIN CONTENT
    ============================================================= */
    content: {

        // Distance from left/right edges.
        //
        // Increase → narrower content.
        // Decrease → wider content.
        paddingHorizontal: 26,

        // Keeps content above the background artwork.
        zIndex: 2,
    },


    /* =============================================================
       SPACE ABOVE HEADLINE
    ============================================================= */
    spacer: {

        // Increase → headline moves DOWN.
        //
        // Decrease → headline moves UP.
        height: 315,
    },


    /* =============================================================
       MAIN HEADLINE
    ============================================================= */
    title: {

        // Headline size.
        fontSize: 29,

        // Space between headline lines.
        lineHeight: 33,

        // Headline boldness.
        fontWeight: "700",

        // Slightly tighter letter spacing.
        letterSpacing: -0.8,

        // Main FluxUP teal.
        color: "#087A70",
    },


    /* =============================================================
       DESCRIPTION
    ============================================================= */
    description: {

        // Space between headline and description.
        //
        // Increase → more space.
        // Decrease → less space.
        marginTop: 17,

        // Prevents description from becoming too wide.
        maxWidth: 355,

        // Description font size.
        fontSize: 14,

        // Space between description lines.
        lineHeight: 21,

        // Normal font weight.
        fontWeight: "400",

        // Muted teal.
        color: "#527D78",
    },


    /* =============================================================
       BUTTON CONTAINER
    ============================================================= */
    buttons: {

        // Space between description and first button.
        marginTop: 28,

        // Space between the two buttons.
        gap: 10,

        // Extra space underneath buttons.
        paddingBottom: 40,
    },


    /* =============================================================
       PRIMARY BUTTON
    ============================================================= */
    primaryButton: {

        // Button height.
        height: 52,

        // Corner roundness.
        //
        // Increase → more rounded.
        // Decrease → more square.
        borderRadius: 14,

        // FluxUP teal button.
        backgroundColor: "#087F70",

        // Text and arrow sit next to each other.
        flexDirection: "row",

        // Center vertically.
        alignItems: "center",

        // Center horizontally.
        justifyContent: "center",
    },


    /* Text inside Create my schedule button */
    primaryText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#FFFFFF",
    },


    /* =============================================================
       ARROW
    ============================================================= */
    arrow: {

        // Space between text and arrow.
        marginLeft: 7,

        // Arrow size.
        fontSize: 18,

        // Arrow color.
        color: "#FFFFFF",
    },


    /* =============================================================
       SECONDARY SIGN-IN BUTTON
    ============================================================= */
    secondaryButton: {

        // Same height as primary button.
        height: 52,

        // Same rounded corners.
        borderRadius: 14,

        // Outline thickness.
        borderWidth: 1,

        // Outline color.
        borderColor: "#9CCFC7",

        // Slightly transparent white background.
        backgroundColor: "rgba(255,255,255,0.45)",

        // Center horizontally.
        alignItems: "center",

        // Center vertically.
        justifyContent: "center",
    },


    /* Sign-in button text */
    secondaryText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#087F70",
    },


    /* =============================================================
       BOTTOM SPARKLE POSITION
    ============================================================= */
    bottomSparkle: {

        // Allows us to position it independently of the layout.
        position: "absolute",

        // Distance from right edge.
        //
        // Increase → sparkle moves LEFT.
        // Decrease → sparkle moves RIGHT.
        right: 42,

        // Distance from bottom.
        //
        // Increase → sparkle moves UP.
        // Decrease → sparkle moves DOWN.
        bottom: 54,

        // Keeps sparkle above artwork.
        zIndex: 3,
    },


    /* Bottom sparkle appearance */
    bottomSparkleText: {

        // Sparkle size.
        fontSize: 40,

        // Sparkle color.
        color: "#76D3C6",
    },
});