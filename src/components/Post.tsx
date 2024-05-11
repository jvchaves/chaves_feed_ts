import { format, formatDistanceToNow } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { Avatar } from './Avatar';
import { Comment } from './Comment';
import { FormEvent, useState, ChangeEvent, InvalidEvent } from 'react';

import styles from './Post.module.css';

interface Author {
  name: string;
  avatarUrl: string;
  role: string;
}

interface Content {
  type: 'paragraph' | 'link';
  content: string;
}

interface PostProps {
  author: Author;
  publishedAt: Date;
  content: Content[];
}

export function Post({ author, publishedAt, content}: PostProps){

const [comments, setComments] = useState([
  'Rapaz, ta toop, so tem você aqui ein!?'
])

const [newCommentText, setNewCommentText] = useState('')

function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>){
  event.target.setCustomValidity('')
  setNewCommentText(event.target.value)
}

const publishedAtDateFormatted = format(publishedAt, "dd 'de' LLLL 'ás' HH:mm'h'", {
  locale: ptBR
})

const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
  locale: ptBR,
  addSuffix: true
})

function handleCreateNewComment(event:FormEvent){
  event.preventDefault()

  setComments([...comments, newCommentText]);
  setNewCommentText('')
}

function deleteComment(commentToDelete: string){
  const commentWithOutDeletedOne = comments.filter(comment => {
    return comment !== commentToDelete
  })

  setComments(commentWithOutDeletedOne);
}

function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>){
  event.target.setCustomValidity('Este Campo é Obrigatorio!')
  console.log(event)
}

const isNewCommentEmpty = newCommentText.length === 0

  return(
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>

        <time title={publishedAtDateFormatted} dateTime={publishedAt.toISOString()}>{ publishedDateRelativeToNow }</time>
      </header>

      <div className={styles.content}>
        {content.map(line =>{
          if (line.type === 'paragraph') {
            return <p key={line.content}>{line.content}</p>
          } else if (line.type === 'link') {
            return <p key={line.content}><a href='#'>{line.content}</a></p>
          }
        })}
      </div>

      <form onSubmit={ handleCreateNewComment } className={ styles.commentForm }>
        <strong>Deixe seu feedback</strong>

        <textarea 
          name="comment"
          placeholder="Deixe um comentário"
          value={newCommentText}
          onChange={handleNewCommentChange}
          onInvalid={handleNewCommentInvalid}
          required
        />

        <footer>
          <button type="submit" disabled={isNewCommentEmpty}>Enviar</button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map(comment => {
          return (
            <Comment 
              key={comment}
              onDeleteComment={deleteComment}
              content={comment}
            />
          )
        })}
      </div>
    </article>
  )
}