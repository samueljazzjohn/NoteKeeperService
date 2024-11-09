const express = require('express');
const router = express.Router();
const { githubCallback } = require('../controllers/authController');


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints for authentication
 */

/**
 * @swagger
 * /github/callback:
 *   get:
 *     summary: GitHub OAuth callback
 *     description: Exchanges the code for an access token and retrieves GitHub user data.
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Authorization code received from GitHub
 *     responses:
 *       200:
 *         description: GitHub user data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 login:
 *                   type: string
 *                   description: GitHub username
 *                 email:
 *                   type: string
 *                   description: GitHub user email
 *                 avatar_url:
 *                   type: string
 *                   description: GitHub user avatar URL
 *                 name:
 *                   type: string
 *                   description: GitHub user full name
 *       400:
 *         description: Error due to missing code or token exchange failure
 *       500:
 *         description: Server error during GitHub OAuth process
 */
router.get('/github/callback', githubCallback);

module.exports = router;
