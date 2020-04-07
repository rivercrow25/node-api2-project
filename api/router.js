const express = require('express')
const db = require('../data/db')
const router = express.Router()

router.post('/', (req, res) => {
    if (req.body.title && req.body.contents) {
        db.insert(req.body)
            .then(post => {
                res.status(201).json(post)
            })
            .catch(error => {
                res.status(500).json({ errorMessage: 'error saving the post' })
            })
    } else {
        res.status(400).json({ errorMessage: 'Please provide title and contents for the post' })
    }
})

router.post('/:id/comments', (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            if (req.body.text) {
                const comment = req.body
                comment.post_id = req.params.id
                db.insertComment(req.body)
                    .then(response => {
                        res.status(201).json(response)
                    })
                    .catch(error => {
                        res.status(500).json({ error: 'there was an error saving the comment' })
                        console.log(error)
                    })
            } else {
                res.status(400).json({ error: 'please provide text for the comment' })
            }
        })
        .catch(error => {
            res.status(404).json({ message: "specified post does not exist" })
        })
})

router.get('/', (req, res) => {
    db.find(req.query)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            res.status(500).json({ message: 'could not find any posts' })
        })
})

router.get('/:id', (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(500).json({ error: 'server error could not retrieve post' })
            }
        })
        .catch(error => {
            res.status(404).json({ error: "post not found" })
        })
})

router.get('/:id/comments', (req, res) => {
    db.findById(req.params.id)
        .then(id => {
            db.findPostComments(req.params.id)
                .then(comments => {
                    res.status(200).json(comments)
                })
                .catch(() => {
                    res.status(500).json({ message: 'error retrieving comments' })
                })
        })
        .catch(error => {
            res.status(404).json({ message: 'the post with the specified id does not exist' })
        })
})

router.delete('/:id', (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            db.remove(req.params.id)
                .then(response => {
                    res.status(200).json(post)
                })
                .catch(() => {
                    res.status(500).json({ message: 'post could not be deleted' })
                })
        })
        .catch(() => {
            res.status(404).json({ error: 'the post with the specified id doesnt exist' })
        })
})

router.put('/:id', (req, res) => {
    if (req.body) {
        db.findById(req.params.id)
            .then(() => {
                db.update(req.params.id, req.body)
                    .then(response => {
                        db.findById(req.params.id)
                            .then(newthing => res.status(200).json(newthing))
                    })
                    .catch(() => {
                        res.status(500).json({ message: 'error saving post to database' })
                    })
            })
            .catch(() => {
                res.status(404).json({ message: 'post with specified id does not exist' })
            })
    } else {
        res.status(400).json({ message: 'please provide a title and contents for the post' })
    }
})

module.exports = router