import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  Card,
  CardContent,
  Typography,
  Grid
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class MeasureItem extends React.Component {
  render() {
    return (
      <React.Fragment>

        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                    <Typography variant="h1" style={{ marginBottom: "15px" }}>
                      <FontAwesomeIcon icon="tachometer-alt" />
                      &nbsp;&nbsp;&nbsp;{this.props.object.name}
                    </Typography>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" mb={6}>
                      Description
                    </Typography>
                    <div className="contentSection">
                      <ReactMarkdown 
                        children={this.props.object.description}     
                        remarkPlugins={[remarkMath,remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                        />
                    </div>
                  </CardContent>
                </Card>
              </Grid>
              { this.props.object.code &&
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h4" mb={6}>
                        Implementation
                      </Typography>
                      <div className="contentSection">
                        <ReactMarkdown 
                          children={this.props.object.code}
                          components={{
                            code({node, inline, className, children, ...props}) {
                              const match = /language-(\w+)/.exec(className || '')
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  children={String(children).replace(/\n$/, '')}
                                  style={dark}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                />
                              ) : (
                                <SyntaxHighlighter
                                  children={String(children).replace(/\n$/, '')}
                                  style={dark}
                                  PreTag="div"
                                  {...props}
                                />
                              )
                            }
                          }}
                          />
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              }
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
