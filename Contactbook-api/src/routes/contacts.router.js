const express = require("express");
const contactsController = require("../controllers/contacts.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
const avatarUpload = require("../middlewares/avatar-upload.middleware");
const router = express.Router();
module.exports.setup = (app) => {
  app.use("/api/v1/contacts", router);
  /**
   * @swagger
   * /api/v1/contacts:
   *   get:
   *     summary: Get contacts by filter
   *     description: Retrieve contacts based on the provided filter
   *     tags:
   *       - Contacts
   *     parameters:
   *       - in: query
   *         name: favorite
   *         schema:
   *           type: boolean
   *         description: Filter contacts by favorite status
   *       - in: query
   *         name: name
   *         schema:
   *           type: string
   *         description: Filter contacts by name
   *       - $ref: '#/components/parameters/limitParam'
   *       - $ref: '#/components/parameters/pageParam'
   *     responses:
   *       200:
   *         description: Contacts retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   enum: [success]
   *                   description: The status of the response
   *                 data:
   *                   type: object
   *                   properties:
   *                     contacts:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Contact'
   *                     metadata:
   *                       $ref: '#/components/schemas/PaginationMetadata'
   *       400:
   *         description: Bad Request
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *                
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       403:
   *         description: Forbidden
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       404:
   *         description: Not Found
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   */
  router.get("/", contactsController.getContactsByFilter);

  /**
   * @swagger
   * /api/v1/contacts:
   *   post:
   *     summary: Create a new contact
   *     description: Create a new contact with the provided data
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/Contact'
   *     tags:
   *       - Contacts
   *     responses:
   *       201:
   *         description: A Contact created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   enum: [success]
   *                   description: The status of the response
   *                 data:
   *                   type: object
   *                   properties:
   *                     contact:
   *                       type:
   *
   *                       $ref: '#/components/schemas/Contact'
   *       400:
   *         description: Bad Request
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *                
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       403:
   *         description: Forbidden
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       404:
   *         description: Not Found
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   */
  router.post("/", avatarUpload, contactsController.createContact);

  /**
   * @swagger
   * /api/v1/contacts:
   *   delete:
   *     summary: Delete all contacts
   *     description: Delete all contacts from the database
   *     tags:
   *       - Contacts
   *     responses:
   *       200:
   *         description: All contacts deleted successfully
   *         $ref: '#/components/responses/200NoData'
   *       400:
   *         description: Bad Request
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *                
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       403:
   *         description: Forbidden
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       404:
   *         description: Not Found
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   */
  router.delete("/", contactsController.deleteAllContacts);
  router.all("/", methodNotAllowed);

  /**
   * @swagger
   * /api/v1/contacts/{id}:
   *   get:
   *     summary: Get a contact by ID
   *     description: Retrieve a contact by its ID
   *     parameters:
   *       - $ref: '#/components/parameters/id'
   *     tags:
   *       - Contacts:
   *     responses:
   *       200:
   *         description: Contact retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   enum: [success]
   *                   description: The status of the response
   *                 data:
   *                   type: object
   *                   properties:
   *                     contact:
   *                       $ref: '#/components/schemas/Contact'
   *       400:
   *         description: Bad Request
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *                
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       403:
   *         description: Forbidden
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       404:
   *         description: Not Found
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *
   */
  router.get("/:id", contactsController.getContact);

  /**
   * @swagger
   * /api/v1/contacts/{id}:
   *   put:
   *     summary: Update a contact by ID
   *     description: Update a contact by its ID
   *     parameters:
   *       - $ref: '#/components/parameters/id'
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/Contact'
   *     tags:
   *       - Contacts
   *     responses:
   *       200:
   *         description: Contact updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   enum: [success]
   *                   description: The status of the response
   *                 data:
   *                   type: object
   *                   properties:
   *                     contact:
   *                       $ref: '#/components/schemas/Contact'
   *       400:
   *         description: Bad Request
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *                
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       403:
   *         description: Forbidden
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       404:
   *         description: Not Found
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   */
  router.put("/:id", avatarUpload, contactsController.updateContact);

  /**
   * @swagger
   * /api/v1/contacts/{id}:
   *   delete:
   *     summary: Delete a contact by ID
   *     description: Delete a contact by its ID
   *     parameters:
   *       - $ref: '#/components/parameters/id'
   *     tags:
   *       - Contacts
   *     responses:
   *       200:
   *         description: Contact deleted successfully
   *         $ref: '#/components/responses/200NoData'
   *       400:
   *         description: Bad Request
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *                
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       403:
   *         description: Forbidden
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       404:
   *         description: Not Found
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: string
   *                  enum: [fail]
   *                  description: The status of the response
   *                message:
   *                  type: string
   *                  description: The error message
   */
  router.delete("/:id", contactsController.deleteContact);
  router.all("/:id", methodNotAllowed);
};
