
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { MessageSquare, ThumbsUp, Flag, Edit3, Trash2 } from 'lucide-react';
import { useReputationContext } from '@/context/ReputationContext';

interface Comment {
  id: string;
  proposalId: string;
  parentId: string | null;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isBlocked: boolean;
}

interface CommentThreadProps {
  proposalId: string;
}

const CommentThread: React.FC<CommentThreadProps> = ({ proposalId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const reputationCtx = useReputationContext();

  useEffect(() => {
    fetchComments();
  }, [proposalId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/proposal/${proposalId}`, {
        headers: {
          'Authorization': `Bearer mock-token`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !isAuthenticated) return;
    setLoading(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer mock-token`,
        },
        body: JSON.stringify({
          proposalId,
          content: newComment,
        }),
      });
      if (response.ok) {
        setNewComment('');
        fetchComments();
        toast({ title: 'Comentario añadido' });
        // Trigger reputation feedback
        reputationCtx?.triggerFeedback({
          type: 'reply',
          text: 'Comentario publicado con éxito',
          points: 5,
        });
      }
    } catch (error) {
      toast({ title: 'Error al añadir comentario', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim() || !isAuthenticated) return;
    setLoading(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer mock-token`,
        },
        body: JSON.stringify({
          proposalId,
          parentId,
          content: replyContent,
        }),
      });
      if (response.ok) {
        setReplyContent('');
        setReplyingTo(null);
        fetchComments();
        toast({ title: 'Respuesta añadida' });
        // Trigger reputation feedback
        reputationCtx?.triggerFeedback({
          type: 'reply',
          text: 'Respuesta publicada con éxito',
          points: 3,
        });
      }
    } catch (error) {
      toast({ title: 'Error al añadir respuesta', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const replies = comments.filter(c => c.parentId === comment.id);
    const isAuthor = user?.id === comment.authorId;

    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''} mb-4`}>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="text-sm text-gray-600">
                {comment.authorId} • {new Date(comment.createdAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                {isAuthor && (
                  <>
                    <Button variant="ghost" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="sm">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-3">{comment.content}</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <ThumbsUp className="h-4 w-4 mr-1" />
                Me gusta
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setReplyingTo(comment.id)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Responder
              </Button>
            </div>
            {replyingTo === comment.id && (
              <div className="mt-4 space-y-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  className="min-h-20"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleReply(comment.id)}
                    disabled={loading || !replyContent.trim()}
                    size="sm"
                  >
                    Responder
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {replies.map(reply => renderComment(reply, depth + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* New comment form */}
      {isAuthenticated ? (
        <div className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Comparte tu opinión sobre esta propuesta..."
            className="min-h-24"
          />
          <Button 
            onClick={handleSubmitComment}
            disabled={loading || !newComment.trim()}
          >
            {loading ? 'Publicando...' : 'Publicar comentario'}
          </Button>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-gray-600">Inicia sesión para participar en el debate</p>
          </CardContent>
        </Card>
      )}

      {/* Comments list */}
      <div>
        {comments.filter(c => !c.parentId).map(comment => renderComment(comment))}
      </div>
    </div>
  );
};

export default CommentThread;
