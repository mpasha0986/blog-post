import Blog from "../model/blog.js";

async function handleCreateBlog(req, res) {
  if (!req.user) return res.redirect("/user/login");
  const { title, body } = req.body;

  await Blog.create({
    title,
    body,
    coverImageUrl: req.file
      ? `/uploads/${req.file.filename}`
      : "/images/default-blog.png",
    generatedBy: req.user._id,
  });
  return res.redirect("/blogs");
}

export const handleDeleteBlog = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/user/login");
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.redirect("/blogs");
    // Only the author can delete their own blog.
    if (String(blog.generatedBy) !== String(req.user._id)) {
      return res.status(403).send("You are not allowed to delete this blog.");
    }
    await Blog.findByIdAndDelete(id);
    return res.redirect(`/user/profile/${req.user._id}`);
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog" });
  }
};

export const getEditBlogPage = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    res.render("createBlog", { blog });
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog for editing" });
  }
};

export const handleEditBlog = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/user/login");
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.redirect("/blogs");
    // Only the author can edit their own blog.
    if (String(blog.generatedBy) !== String(req.user._id)) {
      return res.status(403).send("You are not allowed to edit this blog.");
    }
    const { title, body } = req.body;
    const updateData = {
      title,
      body,
    };
    if (req.file) {
      updateData.coverImageUrl = `/uploads/${req.file.filename}`;
    }
    await Blog.findByIdAndUpdate(id, updateData);
    return res.redirect(`/blogs/${id}`);
  } catch (error) {
    res.status(500).json({ message: "Error editing blog" });
  }
};

export { handleCreateBlog };
